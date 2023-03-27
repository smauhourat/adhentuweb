const fs = require('fs')
const cheerio = require('cheerio');

const $ = cheerio.load(fs.readFileSync("./dist/index.html"))
console.log($.html())
$('')

// var stream = fs.createWriteStream("./dist/index.html");
// const $ = cheerio.load(stream.end(), null, false);
// console.log($.html())

// const fs = require('fs')
// var stream = fs.createWriteStream("./dist/index.html");

// stream.once('open', function() {
//     stream.write('CCC');
//     stream.end();
// });