# Kế hoạch rà soát và đề xuất công việc cho Module Payment

Sau quá trình rà soát module `Payment` trong Juzaweb CMS, tôi đã phát hiện một số vấn đề cần khắc phục cũng như các điểm có thể tối ưu/bổ sung. Dưới đây là danh sách chi tiết các công việc cần làm tiếp theo:

## 1. Khắc phục lỗi Test Cases
Hiện tại, khi chạy `php artisan test modules/Payment`, toàn bộ 20 bài test trong module Payment đều thất bại với lỗi:
`InvalidArgumentException: Unable to resolve migration path for type [laravel]`

**Nguyên nhân:** Lỗi này xảy ra tại file `modules/Payment/Tests/TestCase.php` ở hàm `defineDatabaseMigrations()`.
Có thể môi trường test chưa được setup chính xác, thiếu cấu hình đường dẫn `ThemeRepository` (gây lỗi null ở `config('themes.path')`) hoặc do xung đột với testbench khi load package migrations.

**Đề xuất việc cần làm:**
- Trong `modules/Payment/Tests/TestCase.php`, bổ sung phương thức `getEnvironmentSetUp($app)` để mock configuration, đặc biệt là `themes.path` và `themes.activator` như được đề cập trong quy tắc của dự án (AGENTS.md).
- Nếu routes test trả về lỗi 404 do service provider của payment chưa load, cần thêm: `$app->register(\Juzaweb\Modules\Payment\Providers\PaymentServiceProvider::class);` trong `getEnvironmentSetUp`.
- Sau khi khắc phục lỗi trong `TestCase.php`, chạy lại test và sửa các lỗi fail khác (nếu có).

## 2. Bổ sung Unit & Feature Tests
Sau khi sửa lỗi Test Framework, cần kiểm tra tỷ lệ coverage:
- Rà soát các Class như `OrderController`, `PaymentMethodController`, `PaymentHistoryController` trong `Http/Controllers/API` đã có Feature Test phủ đầy đủ các method (`index`, `store`, `show`, `update`, `destroy`) hay chưa. Hiện tại file test trong `Tests/Feature/` khá ít (chỉ có `OrderApiTest.php`, `PaymentMethodApiTest.php`).
- Bổ sung Test cho class `PaymentHistoryController`.
- Cần viết thêm Unit Test cho các Services, Repositories, Events (`PaymentSuccess`, `PaymentFail`, `PaymentCancel`), Commands thuộc Module Payment (nếu có).

## 3. Hoàn thiện Swagger / OpenAPI Annotations
- Các file controller API (ví dụ: `PaymentMethodController.php`, `OrderController.php`, `PaymentHistoryController.php`) đã được viết Swagger annotations khá tốt cho các endpoint.
- Tuy nhiên, trong Swagger annotations của `OrderController.php` và `PaymentMethodController.php` có tham chiếu đến các schema như:
  - `CreateOrderRequest`
  - `UpdateOrderRequest`
  - `PaymentMethodRequest`
  - `OrderResource`
- **Việc cần làm:** Đảm bảo rằng các Class FormRequest và JsonResource này có `@OA\Schema` annotations rõ ràng để khi generate file `api-docs.json` (`php artisan l5-swagger:generate`) không bị thiếu schema (hoặc lỗi tham chiếu).

## 4. Tối ưu API / Security / Code Quality
- Các controller (như `OrderController`, `PaymentHistoryController`) hiện đã được giới hạn quyền xem theo `user()` và `hasPermissionTo()`. Đây là một điểm tốt về IDOR prevention.
- **Việc cần làm:**
  - Kiểm tra xem middleware `auth:api` đã được áp dụng đúng trên các routes nằm trong thư mục `modules/Payment/routes/api.php` hay chưa.
  - Sử dụng FormRequest riêng biệt trong `Http/Requests/API/` thay vì dùng inline validate, để đảm bảo an toàn về mass-assignment. (Cần kiểm tra `CreateOrderRequest`, `PaymentMethodRequest` đã được định nghĩa đúng chuẩn chưa).

## Tổng kết
Đầu tiên, ưu tiên số 1 là **sửa lỗi `TestCase.php`** để các bài test chạy được, qua đó mới biết chính xác module có đang hoạt động ổn định không. Sau đó, tiến hành **bổ sung test coverage** và **hoàn thiện Swagger schemas**. Cuối cùng là rà soát lại middleware route API.
