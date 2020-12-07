
const fs = require('fs');
const path = require('path');
const libxml = require('libxmljs2');

// Note that if you're receiving the error "Uncaught Error: Invalid XSD schema" it may be due to baseUrl issue
// See https://stackoverflow.com/questions/26294385/invalid-xsd-schema-using-libxmljs-with-nodejs
// I copied files to consolidated location in validator and changed include and import paths, which fixed
const xsd = fs.readFileSync(path.resolve(__dirname, '../CDA_SDTC.xsd')).toString();
const schema = libxml.parseXml(xsd);

module.exports = function (xml) {
  let parsedDoc = libxml.parseXml(xml);
  parsedDoc.validate(schema);
  let validationErrors = parsedDoc.validationErrors || [];
  let errors = [];
  for (let i = 0; i < validationErrors.length; i++) {
    let error = {};
    error.line = validationErrors[i].line;
    error.description = validationErrors[i].message;
    errors.push(error);
  }
  let result = { pass: true };
  if (errors && errors.length) {
    result.status = 'Failed CDA and SDTC Schema Validation';
    result.pass = false;
    result.errors = errors;
  }
  else result.status = 'Passed CDA and SDTC Schema Validation';
  return result;
};
