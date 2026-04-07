<?php

namespace Juzaweb\Modules\DevTool\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;

class JulesPreviewCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'agents:jules-preview {--session= : The Jules Session ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Preview and review code from Google Jules via Ollama local API';

    /**
     * The Ollama API endpoint.
     *
     * @var string
     */
    protected $ollamaUrl = 'http://localhost:11434/api/generate';

    /**
     * The model to use for reviewing code.
     *
     * @var string
     */
    protected $ollamaModel = 'qwen3-coder:480b-cloud';

    /**
     * The system prompt for the review.
     *
     * @var string
     */
    protected $systemPrompt = <<<'PROMPT'
Bạn là một AI Agent chuyên review và đánh giá mã nguồn.
Google Jules vừa tạo ra/đề xuất đoạn mã chức năng (hoặc thông tin hoạt động).

Hãy xem xét dữ liệu sau và thực hiện review code, tìm ra các lỗi theo "Yêu cầu phản hồi" dưới đây:
{jules_data}

Yêu cầu phản hồi (luôn tuân thủ):
- **Validation:** Always create and use a **FormRequest** class.
- **Enum:** Always use **PHP Enums** for status, type,... columns.
- Use English for variable names/comments.
- No "TODO" comments; implement full logic.
- Use camelCase for variable names.
- Use camelCase for method names.
- Use snake_case for function names.
- Use snake_case for table names.
- Use snake_case for column names.
- All PHP code MUST follow the Laravel style coding standard strictly.
- Use the `HasMedia` trait for image fields (e.g., `thumbnail`, `banner`).
- Always define swagger for new API endpoints.
- Always use restSuccess and restFail in trait HasRestResponses for API responses. Using public static function getResource(): string method in model (define in HasResource trait) to custom Resource for api response.

Lưu ý:
- Chỉ list các lỗi theo dạng từng gạch đầu dòng
- Không thêm bất kỳ nội dung nào khác ngoài "Yêu cầu phản hồi"
PROMPT;

    public function handle()
    {
        $apiKey = config('dev-tool.jules.api_key');
        $sessionId = $this->option('session') ?: config('dev-tool.jules.session_id');

        if (empty($apiKey) || empty($sessionId)) {
            $this->error('Lỗi: Vui lòng cung cấp JULES_API_KEY và JULES_SESSION_ID trong file .env hoặc qua tham số --session!');

            return 1;
        }

        $this->info('Bắt đầu quy trình Preview Agent qua Git Diff (Branch từ API)...');

        // 1. Fetch Jules Data
        $julesData = $this->fetchJulesData($apiKey, $sessionId);

        if (empty($julesData)) {
            $this->warn('Không tìm thấy nội dung git diff nào hoặc lỗi khi fetch nhánh.');

            return 1;
        }

        // 2. Preview Code -> call Ollama
        $previewFeedback = $this->previewCode($julesData);

        if (empty($previewFeedback)) {
            $this->error('Lỗi khi gọi lên Ollama API để review mã.');
            return 1;
        }

        $this->info("\n--- KẾT QUẢ CUỐI CÙNG ---");
        $this->line("Feedback đã tạo:\n" . $previewFeedback);

        // 3. Submit feedback back to Jules (Commented out logically as requested)
        // $apiStatus = $this->submitFeedbackToJules($apiKey, $sessionId, $previewFeedback);
        // $this->info("\nTrạng thái API Submition: " . $apiStatus);

        return 0;
    }

    /**
     * Get target branch or PR diff from Jules.
     */
    protected function fetchJulesData(string $apiKey, string $sessionId): ?string
    {
        $branch = $this->getBranchFromJulesApi($apiKey, $sessionId);

        if (! $branch) {
            $this->warn('Không xác định được branch từ API Jules.');

            return null;
        }

        $this->info("--- [1] FETCHING GIT DIFF FROM BRANCH/PR: {$branch} ---");

        return $this->getJulesGitDiff($branch);
    }

    /**
     * Call Jules API to get branch.
     */
    protected function getBranchFromJulesApi(string $apiKey, string $sessionId): ?string
    {
        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
        ])->get("https://jules.googleapis.com/v1alpha/sessions/{$sessionId}");

        if ($response->successful()) {
            $data = $response->json();

            if (isset($data['branch'])) {
                return $data['branch'];
            }

            if (isset($data['sourceContext']['workspaceBranch'])) {
                return $data['sourceContext']['workspaceBranch'];
            }

            $outputs = $data['outputs'] ?? [];
            foreach ($outputs as $out) {
                if (isset($out['pullRequest']['url'])) {
                    $prUrl = $out['pullRequest']['url'];
                    $parts = explode('/', rtrim($prUrl, '/'));
                    $prNum = end($parts);

                    return "pr_{$prNum}";
                }
            }

            $this->warn('Không tìm thấy trường branch hoặc PR hợp lệ trong Response.');

            return null;
        }

        $this->error("Lỗi gọi API Get Session: {$response->status()} - {$response->body()}");

        return null;
    }

    /**
     * Fetch branch from origin and get diff.
     */
    protected function getJulesGitDiff(string $julesBranch, string $baseBranch = 'master'): ?string
    {
        try {
            if (str_starts_with($julesBranch, 'pr_')) {
                $prNum = explode('_', $julesBranch)[1];
                $fetchRef = "pull/{$prNum}/head";
            } else {
                $fetchRef = $julesBranch;
            }

            $this->info("Bắt đầu fetch: origin {$fetchRef}");

            $fetchProcess = Process::run("git fetch origin {$fetchRef}");
            if ($fetchProcess->failed()) {
                $this->error('Lỗi khi git fetch: ' . $fetchProcess->errorOutput());

                return null;
            }

            $diffProcess = Process::run("git diff {$baseBranch}...FETCH_HEAD");
            if ($diffProcess->failed()) {
                $this->error('Lỗi khi git diff: ' . $diffProcess->errorOutput());

                return null;
            }

            return $diffProcess->output();
        } catch (\Exception $e) {
            $this->error('Lỗi git command: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * Send git diff to local Ollama API to generate review.
     */
    protected function previewCode(string $julesData): ?string
    {
        $this->info('--- [2] PREVIEWING GOOGLE JULES CODE (OLLAMA MODEL) ---');

        $prompt = str_replace('{jules_data}', $julesData, $this->systemPrompt);

        $response = Http::timeout(300)->post($this->ollamaUrl, [
            'model' => $this->ollamaModel,
            'prompt' => $prompt,
            'stream' => false,
        ]);

        if ($response->successful()) {
            return $response->json('response');
        }

        $this->error('Ollama API Error: ' . $response->body());

        return null;
    }

    /**
     * Submit feedback/review to Jules session.
     */
    protected function submitFeedbackToJules(string $apiKey, string $sessionId, string $feedback): string
    {
        $this->info('--- [3] SUBMITTING FEEDBACK QUICKLY TO JULES API ---');

        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
            'Content-Type' => 'application/json',
        ])->post("https://jules.googleapis.com/v1alpha/sessions/{$sessionId}:sendMessage", [
            'prompt' => $feedback,
        ]);

        return 'Completed feedback submit with HTTP ' . $response->status();
    }
}
