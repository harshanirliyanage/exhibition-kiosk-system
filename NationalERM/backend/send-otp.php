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

$TEXT_LK_TOKEN     = '#######';
$TEXT_LK_SENDER_ID = '######';

// ── OTP store file (must be writable by Apache/PHP) ──────────────
$OTP_FILE = __DIR__ . '/otp_store.json';

$data  = json_decode(file_get_contents('php://input'), true);
$phone = trim($data['phone'] ?? '');

if (!$phone) {
    http_response_code(400);
    echo json_encode(['error' => 'Phone number required']);
    exit;
}

// Load existing store
$store = file_exists($OTP_FILE)
    ? json_decode(file_get_contents($OTP_FILE), true) ?? []
    : [];

// Save OTP for this phone
$otp = strval(rand(100000, 999999));
$store[$phone] = [
    'otp'      => $otp,
    'expiry'   => time() + 300,  // 5 minutes
    'attempts' => 0,
];

file_put_contents($OTP_FILE, json_encode($store), LOCK_EX);

// ── Send SMS ─────────────────────────────────────────────────────
$textlkPhone = str_replace('+', '', $phone);

$postData = json_encode([
    'api_token' => $TEXT_LK_TOKEN,
    'recipient' => $textlkPhone,
    'sender_id' => $TEXT_LK_SENDER_ID,
    'type'      => 'plain',
    'message'   => "Your OTP is: $otp. Valid for 5 minutes. Do not share this code.",
]);

$ch = curl_init('https://app.text.lk/api/http/sms/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['success' => true, 'message' => 'OTP sent successfully']);
} else {
    http_response_code(500);
    echo json_encode([
        'error'          => 'Failed to send OTP. Please try again.',
        'debug_code'     => $httpCode,
        'debug_response' => $response,
    ]);
}