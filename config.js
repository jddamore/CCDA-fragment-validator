module.exports = {
  basePath: './repos/C-CDA-Examples', // This is the name of the repository which is expected for query
  schematronPath: './CDAR2_IG_CCDA_CLINNOTES_R1_DSTU2.1_2015AUG_Vol2_2019JUNwith_errata.sch', // This is the schematron file expected in validator directory
  vocPath: './voc.xml', // This is the voc XML file expected in validator directory
  server: {
    https: false
  }
};
