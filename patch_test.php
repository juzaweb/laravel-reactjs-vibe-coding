<?php
$content = file_get_contents('modules/Api/Tests/Feature/SettingControllerTest.php');
$content = str_replace('$this->actingAs($this->user);', '$this->actingAs($this->user, "api");', $content);
file_put_contents('modules/Api/Tests/Feature/SettingControllerTest.php', $content);
