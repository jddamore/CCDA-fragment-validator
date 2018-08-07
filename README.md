# CCDA-fragment-validator
Application with website that provides for validation of schematron sections of CCDA documents. 

Example hosted at http://www.ccdamap.com 
(**Note that this site is only used for testing fictional documents, not appropriate for PHI**)

## How it works

Go to base url (e.g. http://localhost/ or http://www.ccdamap.com or where you've hosted)

Inside the text area, paste in XML content from a C-CDA starting with the `<code>` element 

This will return errors and warnings. Note that that schematron is available at HL7 Gforge at following link: https://gforge.hl7.org/gf/project/strucdoc/scmsvn/?action=browse&path=%2Ftrunk%2FC-CDAR2.1%2FSchematron%2FCDAR2_IG_CCDA_CLINNOTES_R1_DSTU2.1_2015AUG.sch&view=log This scehamtron, however, needs some slight modification to work with the parser developed (under 10 rules of 9,000+)

## Application setup 

Download this repository

Install associated packages
`npm install`
(note that if you have trouble installing packages on Windows, try `npm windows-build-tools -g` and re-attempt)

Create a directory in the main folder called repos
`mkdir repos`

Clone the HL7 or other public repository into this folder
`git clone https://github.com/HL7/C-CDA-Examples/`

Copy in the two following files
- C-CDA 2.1 schematron (available at GForge, some modifications necessary) into validator directory
- Vocabulary reference file (voc.xml) into validator directory

Start application
`node app`

## Interface

Main (/): Webpage display a text box for fragments to be inserts. Results displayed to screen. 

Path (/validateAll): Webpage that updates Git repository and then reruns all schematron tests across files 