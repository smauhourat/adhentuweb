const fs = require('fs');
const cheerio = require('cheerio');

const SITE_URL = 'https://www.adhentux.com';

const es_locale = {
    "canonical": `${SITE_URL}/`,
    "og_locale": "es_ES",
    "og_title": "Adhentux | Empresa de Soluciones IT, Diseño Web/UX",
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
    "canonical": `${SITE_URL}/en/`,
    "og_locale": "en_US",
    "og_title": "Adhentux | IT Solutions Company, Web/UX Design",
    "data_typed_person": "What do we do?",
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

function translateFile(filePath, lang, locales, isSubdir = false) {
    const $file = cheerio.load(fs.readFileSync(filePath), null, true);

    $file('html').attr('lang', lang);

    $file("meta[name='description']").attr('content', locales['meta_description']);
    $file("meta[name='keywords']").attr('content', locales['meta_keywords']);

    // Cada idioma se declara canónico de sí mismo. Si la página /en/ apunta al
    // home en español, Google la trata como duplicado y no la indexa.
    $file("link[rel='canonical']").attr('href', locales['canonical']);
    $file("meta[property='og:url']").attr('content', locales['canonical']);
    $file("meta[property='og:locale']").attr('content', locales['og_locale']);
    $file("meta[property='og:title']").attr('content', locales['og_title']);
    $file("meta[property='og:description']").attr('content', locales['meta_description']);
    $file("meta[name='twitter:title']").attr('content', locales['og_title']);
    $file("meta[name='twitter:description']").attr('content', locales['meta_description']);

    $file('.typed-items').attr('data-typed-person', locales['data_typed_person']);

    $file('[name=name]').attr('placeholder', locales['name'].placeholder);
    $file('[name=name]').attr('data-error', locales['name'].data_error);

    $file('[name=email]').attr('placeholder', locales['email'].placeholder);
    $file('[name=email]').attr('data-error', locales['email'].data_error);

    $file('[name=subject]').attr('placeholder', locales['subject'].placeholder);
    $file('[name=subject]').attr('data-error', locales['subject'].data_error);

    $file('[name=message]').attr('placeholder', locales['message'].placeholder);
    $file('[name=message]').attr('data-error', locales['message'].data_error);

    // FAQPage generado desde el DOM ya traducido: queda en el idioma correcto y
    // no se desincroniza si se editan las preguntas del HTML.
    const faqs = [];
    $file('.faq-item').each((_, el) => {
        const pregunta = $file(el).find('h3').first().text().trim();
        const respuesta = $file(el).find('.faq-content').first().text().trim();
        if (pregunta && respuesta) {
            faqs.push({
                '@type': 'Question',
                name: pregunta,
                acceptedAnswer: { '@type': 'Answer', text: respuesta }
            });
        }
    });

    if (faqs.length) {
        const jsonld = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs
        };
        $file('head').append(
            '\n  <script type="application/ld+json">\n  ' +
            JSON.stringify(jsonld, null, 2).replace(/\n/g, '\n  ') +
            '\n  </script>\n'
        );
    }

    // static-i18n reescribe src/href al mover la página a /en/, pero no `poster`.
    if (isSubdir) {
        $file('video[poster]').each((_, el) => {
            const poster = $file(el).attr('poster');
            if (poster && !/^(\.\.\/|\/|https?:|data:)/.test(poster)) {
                $file(el).attr('poster', '../' + poster);
            }
        });
    }

    fs.writeFileSync(filePath, $file.html())
}

translateFile('./dist/index.html', 'es', es_locale);
translateFile('./dist/en/index.html', 'en', en_locale, true);

fs.unlink('dist/en/privacity_en.html', (err) => {
    if (err) throw err;
})

fs.unlink('dist/privacity_en.html', (err) => {
    if (err) throw err;
})

fs.copyFile('privacity_en.html', 'dist/en/privacity.html', (err) => {
    if (err) throw err;
})