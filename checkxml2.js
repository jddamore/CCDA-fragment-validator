const fs = require('fs');
const xmlchecker = require('xmlchecker');
const chalk = require('chalk');

const recurseFiles = function (filepath) {
  fs.stat(filepath, (error, stats) => {
    if (error) {
      console.log(error);
    }
    else if (stats.isDirectory()){
      let subfiles = fs.readdirSync(`${filepath}/`)
      for (let i = 0; i < subfiles.length; i++) {
        recurseFiles(`${filepath}/${subfiles[i]}`);
      }
    }
    else if (filepath.slice(-4).toLowerCase() === '.xml') {
      let file = fs.readFileSync(`${filepath}`, 'utf-8');
      let ok = true;
      try{
        process.stdout.write(`${filepath}...`);
        if (file.slice(0,2) === '<?') {
          xmlchecker.check(file.replace(/sdtc:/gm, ''));
        }
        else {
          xmlchecker.check('<?xml version="1.0" ?>' + '<ClinDoc>' + file.replace(/sdtc:/gm, '') + '</ClinDoc>');
        }
      } 
      catch(err) {
        ok = false;
        console.log(chalk.red('bad'))
        console.log(err);
      }
      finally {
        if (ok) console.log(chalk.green('ok!'))
      }
    }
  });
}

recurseFiles('./files')

/*
for (let i = 0; i < files.length; i++) {
  let file = fs.readFileSync(`./files/${files[i]}`, 'utf-8');
  try{
    xmlchecker.check('<?xml version="1.0" ?>' + '<ClinDoc>' + file.replace(/sdtc:/gm, '') + '</ClinDoc>');
  } 
  catch(err) {
    return err;
  }
  console.log(files[i]);
}
*/
