<?php

require("class.phpmailer.php");
require("class.smtp.php");

$errorMSG = "";

// NAME
if (empty($_POST["name"])) {
    $errorMSG = "Name is required ";
} else {
    $name = $_POST["name"];
}

// EMAIL
if (empty($_POST["email"])) {
    $errorMSG .= "Email is required ";
} else {
    $email = $_POST["email"];
}

// MSG SUBJECT
if (empty($_POST["msg_subject"])) {
    $errorMSG .= "Subject is required ";
} else {
    $msg_subject = $_POST["msg_subject"];
}


// MESSAGE
if (empty($_POST["message"])) {
    $errorMSG .= "Message is required ";
} else {
    $message = $_POST["message"];
}


$EmailTo = "info@adhentux.com";
$Subject = "Contacto Web - adhentux.com";

// Datos de la cuenta de correo utilizada para enviar vía SMTP
$smtpHost = "c2360683.ferozo.com";  // Dominio alternativo brindado en el email de alta 
$smtpUsuario = "web@adhentux.com";  // Mi cuenta de correo
$smtpClave = "Catal1na/";  // Mi contraseña

// prepare email body text
$Body = "";
$Body .= "Name: ";
$Body .= $name;
$Body .= "\n";
$Body .= "Email: ";
$Body .= $email;
$Body .= "\n";
$Body .= "Subject: ";
$Body .= $msg_subject;
$Body .= "\n";
$Body .= "Message: ";
$Body .= $message;
$Body .= "\n";

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->Port = 465; 
$mail->SMTPSecure = 'ssl';
$mail->IsHTML(true); 
$mail->CharSet = "utf-8";

// VALORES A MODIFICAR //
$mail->Host = $smtpHost; 
$mail->Username = $smtpUsuario; 
$mail->Password = $smtpClave;

$mail->From = $email; // Email desde donde envío el correo.
$mail->FromName = $name;
$mail->AddAddress($EmailTo); // Esta es la dirección a donde enviamos los datos del formulario

$mail->Subject = "Adhentux.com - Contacto Web"; // Este es el titulo del email.
$mensajeHtml = nl2br($Body);
$mail->Body = "{$mensajeHtml} <br /><br />{$name}<br />{$email}"; // Texto del email en formato HTML
$mail->AltBody = "{$Body} \n\n {$name} \n {$email}"; // Texto sin formato <HTML></HTML>


// FIN - VALORES A MODIFICAR //

$success = $mail->Send(); 


// redirect to success page
if ($success && $errorMSG == ""){
   echo "success";
}else{
    if($errorMSG == ""){
        echo "Ha ocurrido un error :(";
    } else {
        echo $errorMSG;
    }
}

?>