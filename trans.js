const fs = require('fs');
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync('./dist/index.html'), null, true);

const $emailControl = $('[name=email]');
$emailControl.attr('placeholder', 'ponga aqui su emailXXXX');

console.log($.html());

fs.writeFileSync('./dist/index2.html', $.html())

