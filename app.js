
// Packages
const fs = require('fs');
// const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const config = require('./config');

// Application code
const validator = require('./validator/validator');

// Configuration
const basePath = config.basePath;
var schematronFile = '';

// check for schematron
if (!fs.existsSync('./' + config.schematronPath)){
  console.log(chalk.red('ERROR:') + ' you need to have schematron as listed in config in main project folder');
  return '';
}
else {
  schematronFile = fs.readFileSync('./' + config.schematronPath, 'utf-8');
  console.log(schematronFile.length);
}

// check for repos folder
if (!fs.existsSync('./repos')){
  console.log(chalk.red('ERROR:') + ' you need to have creates repos directory in main project folder');
  return '';
}

// check for GitHub repo. If exists, pull then start server 
if (!fs.existsSync(basePath)){
  console.log(chalk.red('ERROR:') + ' you need to have cloned https://github.com/HL7/C-CDA-Examples to repos folder');
  return '';
}
else {
  shell.cd(basePath);
  var retCode = shell.exec('git pull origin').code;
  if( retCode !== 0){
    shell.exit(1);
    throw(new Error('Error: Git pull failed'));
  }
  console.log(chalk.green('Updated Git Pull: ') + 'ok!');
  console.log(chalk.green('file location starting...'));
  setTimeout(function () {
    startServer();
  }, 2000);
}

// Gets all XML paths from files in repository
const listAllXML = () => {
  var xmlList = [];
  const recurseFind = (relativePath) => {
    // console.log(relativePath);
    let things = fs.readdirSync(relativePath);
    for (let i = 0; i < things.length; i++) {
      if (fs.lstatSync(relativePath + '/' + things[i]).isDirectory()){
        recurseFind(relativePath + '/' + things[i]);
      }
      else {
        if (things[i].slice(-3).toLowerCase() === 'xml'){
          xmlList.push(relativePath.slice(2) + '/' + things[i]);
        }
      }
    }
  }; 
  recurseFind('./');
  return xmlList;
};

const startServer = () => {
  var files = listAllXML();
  console.log(files.length + ' XML files available in repository');
};
