# CCDA-fragment-validator
Application with website that provides for validation of schematron sections of CCDA documents. 

Example website hosted at http://www.ccdamap.com 

(**Note that this site is only used for testing fictional documents, not appropriate for PHI**)

## How it works

Go to base url (e.g. http://localhost/ or where you've hosted)

Inside the text area, paste in XML content from a C-CDA starting with the `<section>` element 

This will return errors and warnings. Note that that schematron is available at HL7 Gforge at following link: https://gforge.hl7.org/gf/project/strucdoc/scmsvn/?action=browse&path=%2Ftrunk%2FC-CDAR2.1%2FSchematron%2FCDAR2_IG_CCDA_CLINNOTES_R1_DSTU2.1_2015AUG.sch&view=log This scehamtron, however, needs some slight modification to work with the parser developed (under 10 rules of 9,000+)

## Application setup

1. Download this repository

`git clone https://github.com//jddamore/CCDA-fragment-validator/`

2. Install associated packages

`npm install`

(note that if you have trouble installing packages on Windows, try `npm windows-build-tools -g` and re-attempt)

3. Create a directory in the main folder called repos

`mkdir repos`

4. Clone the HL7 or other public repository into this new folder

`cd repos`

`git clone https://github.com/HL7/C-CDA-Examples/`

`cd ..`

5. Copy in the two following files into main folder 
- C-CDA 2.1 schematron (available at GForge, some modifications necessary). Provide filename in config
- Vocabulary reference file into main directory. Since this must be referenced, keep voc.xml as filename

6. Start application

`node app`

Steps 1-5 are unncessary on future application restarts. 

## Web application URLs

Main (/): Webpage display a text box for fragments to be inserts. Results displayed to screen. 

Check all repo samples (/validateAll): Webpage that updates Git repository and then reruns all schematron tests across files 