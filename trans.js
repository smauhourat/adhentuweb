const fs = require('fs');
const cheerio = require('cheerio');

const es_locale = {
    "name": {
        "placeholder": "Nombre",
        "data_error": "Por favor ingresa tu Nombre"
    },
    "email": {
        "placeholder": "Email",
        "data_error": "Por favor ingresa tu Email"
    },
    "subject": {
        "placeholder": "Titulo",
        "data_error": "Por favor ingresa el Titulo"
    },
    "message": {
        "placeholder": "Mensaje",
        "data_error": "Por favor ingresa el Mensaje"
    }
}

const en_locale = {
    "name": {
        "placeholder": "Name",
        "data_error": "Please enter your Name"
    },
    "email": {
        "placeholder": "Email",
        "data_error": "Please enter your Email"
    },
    "subject": {
        "placeholder": "Subject",
        "data_error": "Please enter the Subject"
    },
    "message": {
        "placeholder": "Message",
        "data_error": "Please enter the Message"
    }
}


function translateFile(filePath, locales) {
    const $file = cheerio.load(fs.readFileSync(filePath), null, true);

    const $nameControl = $file('[name=name]');
    const $emailControl = $file('[name=email]');
    const $subjectControl = $file('[name=subject]');
    const $messageControl = $file('[name=message]');

    $nameControl.attr('placeholder', locales['name'].placeholder);
    $nameControl.attr('data-error', locales['name'].data_error);

    $emailControl.attr('placeholder', locales['email'].placeholder);
    $emailControl.attr('data-error', locales['email'].data_error);

    $subjectControl.attr('placeholder', locales['subject'].placeholder);
    $subjectControl.attr('data-error', locales['subject'].data_error);

    $messageControl.attr('placeholder', locales['message'].placeholder);
    $messageControl.attr('data-error', locales['message'].data_error);

    fs.writeFileSync(filePath.replace('.html', '2.html'), $file.html())
}

translateFile('./dist/index.html', es_locale);
translateFile('./dist/en/index.html', en_locale);