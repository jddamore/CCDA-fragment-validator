const xmlchecker = require('xmlchecker');
const validator = require('cda-schematron');
const cheerio = require('cheerio');
const fs = require('fs');
const validCCDA = fs.readFileSync('./validator/validEmpty.xml');
const debug = true;

module.exports = (xml, schematron) => {
  var sectionTag = '<section>';
  xml = xml.replace(/<!--[\s\S]*?-->/g, '');
  xml = xml.replace(/<\?[\s\S]*\?>/g, '');
  while (xml.slice(0,1) !== '<' && xml.length) {
    xml = xml.slice(1);
  }
  if (!xml.length || (xml.slice(0,8) !== '<section' && xml.slice(0,11) !== '<component>'))  {
    if (xml.slice(0,13) !== '<section null)'){
      sectionTag = '<section nullFlavor="NI">';
    }
    return {
      description: 'validator did not run, invalid input',
      errorCount: 1, 
      errors: [
        'validation not possible since starting tag is not section or component tag'
      ]
    };
  }
  else {
    try {
      xmlchecker.check('<?xml version="1.0" ?>' + '<ClinDoc>' + xml.replace(/sdtc:/gm, '') + '</ClinDoc>');
    }
    catch (error) {
      return {
        description: 'validator did not run, xml is invalid',
        errorCount: 1, 
        errors: [
          error
        ]
      };
    }
    // Parse and grab original section tempalte
    var $ = cheerio.load(xml, { xmlMode: true });
    var sl = $('section').length;
    var xmls = [];
    // load empty CCDA 2.1 and then remove section of template found
    var $$ = cheerio.load(validCCDA, { xmlMode: true });
    for (let i = 0; i < sl; i++) {
      var section = $('section').eq(i);
      var template = section.children('templateId').eq(0).attr('root');
      $$('templateId[root="' + template + '"]').parent('section').parent('component').remove();
      xmls.push($('section').eq(i).html());
    }
    var body = $$('structuredBody').html();
    // Remove entire component/structuredBody so we can nest acordingly 
    $$('component').eq(0).remove();
    var out = $$('ClinicalDocument').html();
    // bring it all back together in new XML document
    var newout = '<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="/infrastructure/cda/CDA_SDTC.xsd" xmlns:voc="urn:hl7-org:v3/voc" xmlns:sdtc="urn:hl7-org:sdtc">' + out + '<component><structuredBody>' + body;
    for (let j = 0; j < xmls.length; j++) {
      newout += '<component>' + sectionTag + xmls[j] + '</section></component>';
    }  
    newout += '</structuredBody></component></ClinicalDocument>';
    if (debug){
      fs.writeFileSync('./yo.xml', newout);
    }
    return validator.validate(newout, schematron); 
  }
};
