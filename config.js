module.exports = {
  basePath: './repos/C-CDA-Examples', // This is the name of the repository which is expected for query
  schematronPath: './validator/CCDA21.sch', // This is the schematron file expected in validator directory
  vocPath: './repos/C-CDA-Examples/voc.xml', // This is the voc XML file expected in validator directory
  server: {
    https: false
  }
};