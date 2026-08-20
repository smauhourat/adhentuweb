<?php

require("class.phpmailer.php");
require("class.smtp.php");

header("Content-Type: text/plain; charset=utf-8");

// El idioma lo manda el front (es | en) para poder responder en el mismo idioma.
$en = isset($_POST["lang"]) && $_POST["lang"] === "en";

function t($en, $es_txt, $en_txt) {
    return $en ? $en_txt : $es_txt;
}

function responder($codigo, $mensaje) {
    http_response_code($codigo);
    echo $mensaje;
    exit;
}

// ---------------------------------------------------------------------------
// 1. Solo se acepta POST
// ---------------------------------------------------------------------------
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST");
    responder(405, t($en, "Método no permitido.", "Method not allowed."));
}

// ---------------------------------------------------------------------------
// 2. Honeypot: campo oculto que solo completan los bots
// ---------------------------------------------------------------------------
if (!empty($_POST["website"])) {
    // Respondemos 200 "success" a propósito: si el bot ve un error, reintenta.
    responder(200, "success");
}

// ---------------------------------------------------------------------------
// 3. Límite de envíos por IP (5 cada 15 minutos)
// ---------------------------------------------------------------------------
$ip = isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "desconocida";
$archivoLimite = sys_get_temp_dir() . "/adhentux-form-" . md5($ip) . ".txt";
$ventana = 900;   // 15 minutos
$maximo  = 5;

$envios = [];
if (is_readable($archivoLimite)) {
    $envios = array_filter(
        explode(",", (string) file_get_contents($archivoLimite)),
        function ($ts) use ($ventana) { return is_numeric($ts) && (time() - (int) $ts) < $ventana; }
    );
}
if (count($envios) >= $maximo) {
    responder(429, t($en,
        "Demasiados envíos. Por favor esperá unos minutos e intentá de nuevo.",
        "Too many submissions. Please wait a few minutes and try again."
    ));
}

// ---------------------------------------------------------------------------
// 4. Validación (antes se calculaba pero nunca se usaba: el mail salía igual)
// ---------------------------------------------------------------------------
function campo($clave) {
    return isset($_POST[$clave]) ? trim((string) $_POST[$clave]) : "";
}

// mbstring está en prácticamente todos los hostings, pero si faltara esto
// evita un fatal error y degrada a contar bytes.
function longitud($texto) {
    return function_exists("mb_strlen") ? mb_strlen($texto) : strlen($texto);
}

$name        = campo("name");
$email       = campo("email");
$msg_subject = campo("msg_subject");
$message     = campo("message");

$errores = [];

if ($name === "") {
    $errores[] = t($en, "El nombre es obligatorio.", "Name is required.");
} elseif (longitud($name) > 100) {
    $errores[] = t($en, "El nombre es demasiado largo.", "Name is too long.");
}

if ($email === "") {
    $errores[] = t($en, "El email es obligatorio.", "Email is required.");
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || longitud($email) > 254) {
    $errores[] = t($en, "El email no es válido.", "The email address is not valid.");
}

if ($msg_subject === "") {
    $errores[] = t($en, "El título es obligatorio.", "Subject is required.");
} elseif (longitud($msg_subject) > 150) {
    $errores[] = t($en, "El título es demasiado largo.", "Subject is too long.");
}

if ($message === "") {
    $errores[] = t($en, "El mensaje es obligatorio.", "Message is required.");
} elseif (longitud($message) > 5000) {
    $errores[] = t($en, "El mensaje es demasiado largo.", "Message is too long.");
}

// Saltos de línea en cabeceras = intento de header injection.
foreach ([$name, $email, $msg_subject] as $valor) {
    if (preg_match("/[\r\n]/", $valor)) {
        responder(422, t($en, "Los datos enviados no son válidos.", "The submitted data is not valid."));
    }
}

if ($errores) {
    responder(422, implode(" ", $errores));
}

// ---------------------------------------------------------------------------
// 5. Credenciales SMTP: variables de entorno primero, si no config.php
// ---------------------------------------------------------------------------
$config = file_exists(__DIR__ . "/config.php") ? require(__DIR__ . "/config.php") : [];

function smtp_setting($config, $key, $env, $default = null) {
    $value = getenv($env);
    if ($value !== false && $value !== "") {
        return $value;
    }
    return isset($config[$key]) ? $config[$key] : $default;
}

$smtpHost    = smtp_setting($config, "host", "SMTP_HOST");
$smtpUsuario = smtp_setting($config, "user", "SMTP_USER");
$smtpClave   = smtp_setting($config, "pass", "SMTP_PASS");
$smtpPuerto  = smtp_setting($config, "port", "SMTP_PORT", 465);
$smtpSecure  = smtp_setting($config, "secure", "SMTP_SECURE", "ssl");
$EmailTo     = smtp_setting($config, "to", "MAIL_TO", "info@adhentux.com");

if (empty($smtpHost) || empty($smtpUsuario) || empty($smtpClave)) {
    // No exponemos el detalle al visitante; queda registrado en el log del servidor.
    error_log("form-process: faltan credenciales SMTP (config.php o variables de entorno).");
    responder(500, t($en,
        "El formulario no está disponible en este momento.",
        "The form is not available right now."
    ));
}

// ---------------------------------------------------------------------------
// 6. Armado y envío
// ---------------------------------------------------------------------------
$Body = "Nombre: {$name}\n"
      . "Email: {$email}\n"
      . "Título: {$msg_subject}\n"
      . "Mensaje:\n{$message}\n";

// new PHPMailer(true) habilita las excepciones. Sin el `true`, send() devuelve
// false en silencio y el visitante veía "enviado correctamente" igual.
$mail = new PHPMailer(true);
$mail->IsSMTP();
$mail->SMTPAuth   = true;
$mail->Host       = $smtpHost;
$mail->Port       = $smtpPuerto;
$mail->SMTPSecure = $smtpSecure;
$mail->Username   = $smtpUsuario;
$mail->Password   = $smtpClave;
$mail->CharSet    = "utf-8";
$mail->IsHTML(true);

// El From debe ser nuestra propia casilla o SPF/DKIM fallan y el mail cae en
// spam. El email del visitante va en Reply-To, que es donde sirve.
$mail->From     = $smtpUsuario;
$mail->FromName = "Contacto Web - adhentux.com";
$mail->AddReplyTo($email, $name);
$mail->AddAddress($EmailTo);

$mail->Subject = "Adhentux.com - Contacto Web: " . $msg_subject;
$mail->Body    = nl2br(htmlspecialchars($Body, ENT_QUOTES, "UTF-8"));
$mail->AltBody = $Body;

try {
    if (!$mail->Send()) {
        throw new Exception($mail->ErrorInfo);
    }

    // Envío exitoso: recién acá contabilizamos el intento.
    $envios[] = time();
    @file_put_contents($archivoLimite, implode(",", $envios), LOCK_EX);

    echo "success";
} catch (Exception $e) {
    // El detalle va al log, no al navegador (puede filtrar host/usuario SMTP).
    error_log("form-process: fallo el envio - " . $e->getMessage());
    responder(500, t($en,
        "No pudimos enviar tu mensaje. Escribinos a info@adhentux.com.",
        "We could not send your message. Please write to info@adhentux.com."
    ));
}
