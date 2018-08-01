# CCDA-fragment-validator
Application with website that provides for validation of schematron sections of CCDA documents. 

Example hosted at http://www.ccdamap.com 
(**Note that this site is only used for testing fictional documents, not appropriate for PHI**)

## How it works

Two types of documents are acceptable: 
1) Complete C-CDA documents (must be C-CDA 2.1). THis must start with `<ClinicalDocument>`
2) A fragtment of a C-CDA document. This must start with `<section>` 

Returns only errors (no warning or info) from C-CDA 2.1 schematron. Note that that schematron is available at HL7 Gforge at following link: https://gforge.hl7.org/gf/project/strucdoc/scmsvn/?action=browse&path=%2Ftrunk%2FC-CDAR2.1%2FSchematron%2FCDAR2_IG_CCDA_CLINNOTES_R1_DSTU2.1_2015AUG.sch&view=log

## Application install and start

Requires Node to be installed

`npm install`
`node app`

## Interface

Webpage display a text box for fragments to be inserts. Results displayed to screen. 

Also includes a button that will scrub all section to be validated from: https://github.com/HL7/C-CDA-Examples/
