const fs = require('fs');
const cheerio = require('cheerio');

const es_locale = {
    "data_typed_person": "Que hacemos?",
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
    "data_typed_person": "What we do?",
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

    const $heroFirstTextCtrl = $file('.typed-items');
    const $nameCtrl = $file('[name=name]');
    const $emailCtrl = $file('[name=email]');
    const $subjectCtrl = $file('[name=subject]');
    const $messageCtrl = $file('[name=message]');

    $heroFirstTextCtrl.attr('data-typed-person', locales['data_typed_person']);

    $nameCtrl.attr('placeholder', locales['name'].placeholder);
    $nameCtrl.attr('data-error', locales['name'].data_error);

    $emailCtrl.attr('placeholder', locales['email'].placeholder);
    $emailCtrl.attr('data-error', locales['email'].data_error);

    $subjectCtrl.attr('placeholder', locales['subject'].placeholder);
    $subjectCtrl.attr('data-error', locales['subject'].data_error);

    $messageCtrl.attr('placeholder', locales['message'].placeholder);
    $messageCtrl.attr('data-error', locales['message'].data_error);

    //fs.writeFileSync(filePath.replace('.html', '2.html'), $file.html())
    fs.writeFileSync(filePath, $file.html())
}

translateFile('./dist/index.html', es_locale);
translateFile('./dist/en/index.html', en_locale);
