const fs = require('fs');
const schema = require('./validator/schema-validator');

let directories = fs.readdirSync('../ccda-online/scripts/xml');

let write = '';

for (let i = 0; i < directories.length; i++) {
    let files = fs.readdirSync(`../ccda-online/scripts/xml/${directories[i]}`);
    for (let j = 0; j < files.length; j++) {
        if (files[j].slice(-3).toLowerCase() === 'xml') {
            let file = fs.readFileSync(`../ccda-online/scripts/xml/${directories[i]}/${files[j]}`, 'utf-8');
            
            write += `*****${files[j]}*****`
            let xml = `${file}`;
            //console.log(xml)
            try {
                write += schema(`<?xml version="1.0" encoding="UTF-8"?>${xml}`);
            }
            catch (e) {
                write += e;

            }
            //console.log(schema(`<?xml version="1.0" encoding="UTF-8"?>${xml}`));
        }
    }
}

fs.writeFileSync('./ouptut.txt', write);