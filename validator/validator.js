const validator = require('cda-schematron');
const cheerio = require('cheerio');
const fs = require('fs');
const validCCDA = fs.readFileSync('./validEmpty.xml');
const debug = true;

module.exports = (xml, schematron) => {
  // Parse and grab original section tempalte
  var $ = cheerio.load(xml, { xmlMode: true });
  var section = $('section').eq(0);
  var template = section.children('templateId').eq(0).attr('root');
  // load empty CCDA 2.1 and then remove section of template found
  var $$ = cheerio.load(validCCDA, { xmlMode: true });
  $$('templateId[root="' + template + '"]').parent('section').parent('component').remove();
  var body = $$('structuredBody').html();
  // Remove entire component/structuredBody so we can nest acordingly 
  $$('component').eq(0).remove();
  var out = $$('ClinicalDocument').html();
  // bring it all back together in new XML document
  var newout = '<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="/infrastructure/cda/CDA_SDTC.xsd" xmlns:voc="urn:hl7-org:v3/voc" xmlns:sdtc="urn:hl7-org:sdtc">' + out + '<component><structuredBody>' + body + '<component>' + xml + '</component></structuredBody></component></ClinicalDocument>';  
  if (debug){
    fs.writeFileSync('./yo1.xml', newout);
  }
  return validator.validate(newout, schematron); 
};
