const fs = require('fs');

fs.unlink('dist/en/privacity_en.html', (err) => {
    if (err) throw err;
    console.log('work done')
})

fs.unlink('dist/privacity_en.html', (err) => {
    if (err) throw err;
    console.log('work done')
})

fs.copyFile('privacity_en.html', 'dist/en/privacity.html', (err) => {
    if (err) throw err;
    console.log('work done')
})