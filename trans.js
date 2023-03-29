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
    },
    "meta_description": "Somos una Empresa que Brinda Soluciones IT, Diseño Web/UX,  Desarrollo Aplicaciones, Implementaciones de E-Commerce",
    "meta_keywords": "Diseño Web, Diseño UX, Desarrollo de Aplicaciones, E-Commerce, IT"
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
    },
    "meta_description": "We are a Company that Provides IT Solutions, Web/UX Design, Application Development, E-Commerce implementations",
    "meta_keywords": "Web Design, UX Design, Application Development, E-Commerce, IT"
}

function translateFile(filePath, lang, locales) {
    const $file = cheerio.load(fs.readFileSync(filePath), null, true);

    $file('html').attr('lang', lang);

    $file("meta[name='description']").attr('content', locales['meta_description']);
    $file("meta[name='keywords']").attr('content', locales['meta_keywords']);
    $file('.typed-items').attr('data-typed-person', locales['data_typed_person']);

    $file('[name=name]').attr('placeholder', locales['name'].placeholder);
    $file('[name=name]').attr('data-error', locales['name'].data_error);

    $file('[name=email]').attr('placeholder', locales['email'].placeholder);
    $file('[name=email]').attr('data-error', locales['email'].data_error);

    $file('[name=subject]').attr('placeholder', locales['subject'].placeholder);
    $file('[name=subject]').attr('data-error', locales['subject'].data_error);

    $file('[name=message]').attr('placeholder', locales['message'].placeholder);
    $file('[name=message]').attr('data-error', locales['message'].data_error);

    //fs.writeFileSync(filePath.replace('.html', '2.html'), $file.html())
    fs.writeFileSync(filePath, $file.html())
}

translateFile('./dist/index.html', 'es', es_locale);
translateFile('./dist/en/index.html', 'en', en_locale);

fs.unlink('dist/en/privacity_en.html', (err) => {
    if (err) throw err;
})

fs.unlink('dist/privacity_en.html', (err) => {
    if (err) throw err;
})

fs.copyFile('privacity_en.html', 'dist/en/privacity.html', (err) => {
    if (err) throw err;
})