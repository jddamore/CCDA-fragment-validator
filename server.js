const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const textParser = bodyParser.text({ type: '*/*', limit: '50Mb' });
// const shell = require('shelljs');
const validator = require('./validator/validator');
const index = fs.readFileSync('./html/index.html', 'utf-8');
const validateAll = fs.readFileSync('./html/validateAll.html', 'utf-8');
var io; 

module.exports = (config, schematron, allFiles) => {
  const app = express();
  app.get('/', (req, res) => res.send(index));
  app.post('/validate', textParser, (req, res) => {
    var xml = req.body.toString();
    // console.log(xml);
    var results = validator(xml, schematron);
    // console.log(results);
    for (var i = 0; i < results.errors.length; i++){
      delete results.errors[i].xml;
      results.errors[i].line -= 709; 
    }
    var warnings = [];
    for (var j = 0; j < results.warnings.length; j++){
      delete results.warnings[j].xml;
      results.warnings[j].line -= 709;
      // Only keep warnings not from example CCDA
      if (results.warnings[j].line > 0){
        warnings.push(results.warnings[j]);
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
      io.emit('update', 'starting XML validation of ' + allFiles.length + ' files', { for: 'everyone' });
      var k = 0;
      const recurse = () => {
        if (k < allFiles.length){
          var file = fs.readFileSync('./' + allFiles[k], 'utf-8');
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
          else {
            console.log(file.slice(0,5));
          }
          if (!results){
            io.emit('update', 'SKIPPED: ' + allFiles[k]+'\r\n', { for: 'everyone' });
            // console.log('SKIPPED: ' + allFiles[k]+'\r\n');
          }
          else {
            if (results.errorCount === 0){
              io.emit('update', 'OK!: ' + allFiles[k]+'\r\n', { for: 'everyone' });
              // console.log('OK!: ' + allFiles[k]+'\r\n');
            }
            else {
              io.emit('update', 'ERROR: ' + allFiles[k]+'\r\n', { for: 'everyone' });
              // console.log('ERROR: ' + allFiles[k]+'\r\n');
            }
          }
          k++;
          setTimeout(function () {
            recurse();
          }, 250);
        }
      };
      recurse();
    }, 1000);
        
  });
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