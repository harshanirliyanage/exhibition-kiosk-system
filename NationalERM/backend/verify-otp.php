<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$OTP_FILE = __DIR__ . '/otp_store.json';

$data  = json_decode(file_get_contents('php://input'), true);
$phone = trim($data['phone'] ?? '');
$code  = trim($data['code']  ?? '');

if (!$phone || !$code) {
    http_response_code(400);
    echo json_encode(['error' => 'Phone and code required']);
    exit;
}

// Load store
$store = file_exists($OTP_FILE)
    ? json_decode(file_get_contents($OTP_FILE), true) ?? []
    : [];

$record = $store[$phone] ?? null;

if (!$record) {
    http_response_code(400);
    echo json_encode(['error' => 'No OTP found. Please request a new one.']);
    exit;
}

if (time() > (int)$record['expiry']) {
    unset($store[$phone]);
    file_put_contents($OTP_FILE, json_encode($store), LOCK_EX);
    http_response_code(400);
    echo json_encode(['error' => 'Code expired. Please request a new one.']);
    exit;
}

if ((int)$record['attempts'] >= 3) {
    unset($store[$phone]);
    file_put_contents($OTP_FILE, json_encode($store), LOCK_EX);
    http_response_code(400);
    echo json_encode(['error' => 'Too many attempts. Please request a new code.']);
    exit;
}

if ($record['otp'] !== $code) {
    $store[$phone]['attempts']++;
    file_put_contents($OTP_FILE, json_encode($store), LOCK_EX);
    http_response_code(400);
    echo json_encode(['error' => 'Invalid code. Please try again.']);
    exit;
}

// ✅ Success — remove used OTP
unset($store[$phone]);
file_put_contents($OTP_FILE, json_encode($store), LOCK_EX);

echo json_encode(['success' => true, 'message' => 'OTP verified successfully']);