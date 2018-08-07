const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const textParser = bodyParser.text({ type: '*/*', limit: '50Mb' });
const chalk = require('chalk');
const shell = require('shelljs');
const validator = require('./validator/validator');
const index = fs.readFileSync('./html/index.html', 'utf-8');
const validateAll = fs.readFileSync('./html/validateAll.html', 'utf-8');
var io; 
var files = []; 

function listAllXML () {
  var xmlList = [];
  const recurseFind = (relativePath) => {
    // console.log(relativePath);
    let things = fs.readdirSync(relativePath);
    for (let i = 0; i < things.length; i++) {
      if (fs.lstatSync(relativePath + '/' + things[i]).isDirectory()){
        recurseFind(relativePath + '/' + things[i]);
      }
      else {
        if (things[i].slice(-3).toLowerCase() === 'xml' && things[i] !== 'voc.xml' &&  things[i] !== 'yo.xml'){
          xmlList.push(relativePath.slice(2) + '/' + things[i]);
        }
      }
    }
  }; 
  recurseFind('./');
  return xmlList;
}

function updateGit (config, cb) {
  // moving to directory and updating git
  shell.cd(config.basePath);
  var retCode = shell.exec('git pull origin').code;
  if( retCode !== 0){
    shell.exit(1);
    throw(new Error('Error: Git pull failed'));
  }
  console.log(chalk.green('Updated Git Pull: ') + 'ok!'); 
  // moving to directory and updating git
  console.log(chalk.green('file location starting...'));
  files = listAllXML();
  console.log(files.length + ' files located');
  // moving back to base path 
  var substring = config.basePath;
  while (substring.indexOf('/') !== -1){
    shell.cd('..');
    substring = substring.slice(substring.indexOf('/')+1); 
  }
  setTimeout(function () {
    cb();
  }, 5000);  
}

module.exports = (config, schematron) => {

  const app = express();
  app.get('/', (req, res) => res.send(index));
  app.post('/validate', textParser, (req, res) => {
    var xml = req.body.toString();
    // console.log(xml);
    var results = validator(xml, schematron);
    // console.log(results);
    if (!results.description){
      for (var i = 0; i < results.errors.length; i++){
        delete results.errors[i].xml;
        if (results.errors[i].hasOwnProperty('line')) {
          results.errors[i].line -= 709; 
        }
      }  
    }
    var warnings = [];
    if (results.warnings) {
      for (var j = 0; j < results.warnings.length; j++){
        delete results.warnings[j].xml;
        results.warnings[j].line -= 709;
        // Only keep warnings not from example CCDA
        if (results.warnings[j].line > 0){
          warnings.push(results.warnings[j]);
        } 
      }  
    }
    results.warnings = warnings;
    results.warningCount = warnings.length;
    res.send(results);
  });
  app.get('/validateAll', (req, res) => {
    res.send(validateAll);
    setTimeout(function () {
      io.on('connection', function(socket){
        console.log('connection via socket.io');
        socket.on('update', function(msg){
          io.emit('update', msg);
        });
      });
      var k = 0;
      var cb = () => {
        io.emit('update', 'starting XML validation of ' + files.length + ' files', { for: 'everyone' });
        const recurse = () => {
          if (k < files.length){
            var file = fs.readFileSync('./' + config.basePath + '/' + files[k], 'utf-8');
            var results = null;
            file = file.replace(/<!--[\s\S]*?-->/g, '');
            file = file.replace(/<\?[\s\S]*\?>/g, '');
            while (file.slice(0,1) !== '<' && file.length) {
              file = file.slice(1);
            }
            // only process section or component tags
            if (file.slice(0,3) === '<se' || file.slice(0,3) === '<co') {
              results = validator(file, schematron);
            }
            if (!results){
              io.emit('update', 'SKIPPED: ' + files[k]+'\r\n', { for: 'everyone' });
              // console.log('SKIPPED: ' + files[k]+'\r\n');
            }
            else {
              if (results.errorCount === 0){
                io.emit('update', 'OK!: ' + files[k]+'\r\n', { for: 'everyone' });
                // console.log('OK!: ' + files[k]+'\r\n');
              }
              else {
                io.emit('update', 'ERROR: ' + files[k]+'\r\n', { for: 'everyone' });
                // console.log('ERROR: ' + files[k]+'\r\n');
              }
            }
            k++;
            setTimeout(function () {
              recurse();
            }, 250);
          }
          else {
            io.emit('update', 'completed XML validation of ' + files.length + ' files', { for: 'everyone' });
          }
        };
        recurse();  
      };
      updateGit(config, cb);
    }, 1000); 
  });
  const cb2 = () => {
    if (config.server.https){
      var https = require('https').Server(app);
      io = require('socket.io')(https);
      https.listen(443, () => console.log('HTTPS: app listening on port 443!'));
    }
    else {
      var http = require('http').Server(app);
      io = require('socket.io')(http);
      http.listen(80, () => console.log('HTTP: app listening on port 80!'));
      // app.listen(80, () => console.log('HTTP: app listening on port 80!'));
    }
  };
  // initial startup of Git update
  updateGit(config, cb2);   
};