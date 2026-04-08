<?php
$content = file_get_contents('modules/Api/Tests/Feature/SettingControllerTest.php');
$auth_setup = <<<'EOL'
        config(['auth.guards.api' => [
            'driver' => 'session',
            'provider' => 'users',
        ]]);

        $this->actingAs($this->user, 'api');
EOL;
$content = str_replace('$this->actingAs($this->user);', $auth_setup, $content);
file_put_contents('modules/Api/Tests/Feature/SettingControllerTest.php', $content);
