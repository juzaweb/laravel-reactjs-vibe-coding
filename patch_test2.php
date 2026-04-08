<?php
$content = file_get_contents('modules/Api/Tests/Feature/SettingControllerTest.php');
$content = str_replace('$this->actingAs($this->user, "api");', '$this->actingAs($this->user);', $content);
file_put_contents('modules/Api/Tests/Feature/SettingControllerTest.php', $content);
