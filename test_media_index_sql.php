<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = new \Illuminate\Http\Request();
$request->merge(['file_type' => 'image']);

$query = \Juzaweb\Modules\Core\Models\Media::query();
$query->api($request->all());

echo "--- file_type=image ---\n";
echo $query->toSql();
echo "\n";
print_r($query->getBindings());
