<?php

$fileController = './modules/Api/Http/Controllers/MediaController.php';
$contentController = file_get_contents($fileController);

// Ensure we don't have $fileType stuff manually appended.
$contentController = preg_replace(
    "/\\\$fileType = \\\$request->input\('file_type'\);\n\n        \\\$query = Media::query\(\);\n/s",
    "\$query = Media::query();\n",
    $contentController
);

$contentController = preg_replace(
    "/        if \(\\\$fileType\) \{\n            \\\$query->fileTypeFilterable\(\[\'file_type\' => \\\$fileType\]\);\n        \}\n/s",
    "",
    $contentController
);

file_put_contents($fileController, $contentController);
echo "Patched MediaController.php successfully\n";
