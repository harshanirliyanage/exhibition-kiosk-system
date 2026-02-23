<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit();
}

// ── DB connection ────────────────────────────────────────────────
function getMySqlConnection() {
    $host     = '#######';
    $username = '######';
    $password = '######';
    $database = '#######';
    $conn = new mysqli($host, $username, $password, $database);
    if ($conn->connect_error) {
        die(json_encode(["success" => false, "error" => "DB connection failed: " . $conn->connect_error]));
    }
    $conn->set_charset("utf8");
    return $conn;
}

// ── Confirmation SMS function ────────────────────────────────────
function sendConfirmationSMS($phone, $name) {
    $TEXT_LK_TOKEN     = '########';
    $TEXT_LK_SENDER_ID = '######';

    // Use first name only for a friendly greeting
    $firstName = explode(' ', trim($name))[0];

    // Remove + sign for TEXT.LK API
    $textlkPhone = str_replace('+', '', $phone);

    // ── Message ──────────────────────────────────────────────────
    $message =
        "Hi $firstName! Thank you for registering. " .
        "Show this SMS at our showroom & get an EXCLUSIVE discount! " .
        "For more info: " .
        "Pipes & Fittings: nationalpvc.com | " .
        "Electric Products: kryptonelectric.com";

    $payload = json_encode([
        'api_token' => $TEXT_LK_TOKEN,
        'recipient' => $textlkPhone,
        'sender_id' => $TEXT_LK_SENDER_ID,
        'type'      => 'plain',
        'message'   => $message,
    ]);

    $ch = curl_init('https://app.text.lk/api/http/sms/send');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
    ]);
    // ✅ CURLOPT_TIMEOUT removed — was causing SMS to silently fail
    curl_exec($ch);
    curl_close($ch);
    // SMS errors are intentionally ignored so registration still succeeds
}

// ── Read JSON body ───────────────────────────────────────────────
$body = json_decode(file_get_contents("php://input"), true);
if (!$body) {
    echo json_encode(["success" => false, "error" => "Invalid JSON"]);
    exit();
}

// Map fields from React form → DB columns
$telNo           = trim($body['phone']        ?? '');
$cusName         = trim($body['name']         ?? '');
$email           = trim($body['email']        ?? '');
$cusCategory     = trim($body['profession']   ?? '');
$cusOrganization = trim($body['organization'] ?? '');
$regLocation     = trim($body['regLocation']  ?? 'Kiosk');

// Basic server-side validation
if (empty($telNo) || empty($cusName)) {
    echo json_encode(["success" => false, "error" => "Name and phone are required"]);
    exit();
}

$conn = getMySqlConnection();

// ── Check: already registered? ───────────────────────────────────
$checkStmt = $conn->prepare("SELECT ID FROM CUSTOMER_REGISTRATION WHERE TelNo = ? LIMIT 1");
$checkStmt->bind_param("s", $telNo);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $checkStmt->close();
    $conn->close();
    echo json_encode([
        "success" => false,
        "error"   => "already_registered",
        "message" => "This phone number is already registered."
    ]);
    exit();
}
$checkStmt->close();

// ── Insert new registration ──────────────────────────────────────
$insertStmt = $conn->prepare(
    "INSERT INTO CUSTOMER_REGISTRATION (TelNo, RegLocation, CusName, Email, CusCategory, CusOrganization)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$insertStmt->bind_param(
    "ssssss",
    $telNo,
    $regLocation,
    $cusName,
    $email,
    $cusCategory,
    $cusOrganization
);

if ($insertStmt->execute()) {
    $newId = $conn->insert_id;
    $insertStmt->close();
    $conn->close();

    // ✅ Send confirmation SMS after successful DB insert
    sendConfirmationSMS($telNo, $cusName);

    echo json_encode([
        "success" => true,
        "message" => "Registration saved successfully",
        "id"      => $newId
    ]);
} else {
    $error = $insertStmt->error;
    $insertStmt->close();
    $conn->close();
    echo json_encode(["success" => false, "error" => "Insert failed: " . $error]);
}
?>