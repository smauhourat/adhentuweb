<?php
// procesar_email_html.php
define('DATA_FILE', 'emails_no_mailing.txt');

if (isset($_GET['email'])) {
    $email = filter_var($_GET['email'], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Verificar si ya existe
        $existingEmails = [];
        if (file_exists(DATA_FILE)) {
            $existingEmails = file(DATA_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        }
        
        if (!in_array($email, $existingEmails)) {
            // Guardar en archivo
            file_put_contents(DATA_FILE, $email . PHP_EOL, FILE_APPEND | LOCK_EX);
            $message = "✅ Email registrado correctamente: " . htmlspecialchars($email);
            $success = true;
        } else {
            $message = "⚠️ Email ya registrado: " . htmlspecialchars($email);
            $success = true;
        }
    } else {
        $message = "❌ Email no válido: " . htmlspecialchars($email);
        $success = false;
    }
} else {
    $message = "❌ Parámetro email requerido";
    $success = false;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Email - No Mailing</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        .header {
            /* background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); */
            background: #F79685;
            background: linear-gradient(38deg, rgba(247, 150, 133, 1) 10%, rgba(232, 124, 102, 1) 43%, rgba(220, 61, 151, 1) 73%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .content {
            padding: 30px;
        }

        .footer {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .button {
            display: inline-block;
            background-color: #C62737;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            border-radius: 30px;
        }

        .highlight {
            color: #C62737;
            font-weight: bold;
        }

        .divider {
            border-top: 1px solid #eeeeee;
            margin: 25px 0;
        }

        .success {
            color: #28a745;
        }

        .error {
            color: #dc3545;
        }

        .info {
            color: #17a2b8;
        }

        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
        }
    </style>
</head>

<body>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
        style="margin: 0; padding: 20px 0; background-color: #f7f7f7;">
        <tr>
            <td>
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <div class="logo">Adhentux</div>
                            <!-- <h1 style="margin: 0; font-size: 22px;">Desuscripcion a mailing</h1> -->
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <h1 style="margin: 0; font-size: 18px;">Registro para no recibir mailing</h1>
                            <div class="<?php echo $success ? 'success' : 'error'; ?>">
                                <h2 style="font-size: 18px;">
                                    <?php echo $message; ?>
                                </h2>
                            </div>
                            <p><a href="javascript:history.back()">← Volver atrás</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
