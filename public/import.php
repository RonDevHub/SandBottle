<?php
require_once __DIR__ . '/../src/Config.php';
require_once __DIR__ . '/../src/Sanity/BackupValidator.php';

use SandBottle\Sanity\BackupValidator;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

if (!isset($_FILES['backup'])) {
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['backup'];

if ($file['size'] > \SandBottle\Config::MAX_BACKUP_SIZE) {
    echo json_encode(['error' => 'File too large']);
    exit;
}

$content = file_get_contents($file['tmp_name']);
$validatedData = BackupValidator::validate($content);

if (!$validatedData) {
    echo json_encode(['error' => 'Invalid or corrupted backup file']);
    exit;
}

echo json_encode($validatedData);