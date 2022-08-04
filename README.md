# CCDA-fragment-validator
Application with website that provides for validation of schematron sections of CCDA documents. 

Example website hosted by [More Informatics](https://moreinformatics.com/) at http://www.ccda.io

(**Note that this site is only used for testing fictional documents, not appropriate for PHI**)

## How it works

Go to base url (e.g. http://localhost/ or where you've hosted)

Inside the text area, paste in XML content from a C-CDA starting with the `<section>` element 

This validator will return both schema and schematron errors for C-CDA documents. 

The schematron is based on files here: 
- https://github.com/HL7/cda-ccda-2.1/blob/master/schematron/CDAR2_IG_CCDA_CLINNOTES_R1_DSTU2.1_2015AUG_Vol2_2019JUNwith_errata.sch
- https://github.com/HL7/cda-ccda-2.1/blob/master/schematron/voc.xml
(Note This schematron, however, needs some slight modification to work with the parser developed (under 10 rules of 9,000+))

The schema is based on on files in this repo: https://github.com/HL7/cda-core-2.0/ (copied December 2020)

This will return schema errors, schematron errors and schematron warnings.  
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

5. Start application

`node app`

Steps 1-4 are unncessary on future application restarts. 

## Web application URLs

Main (/): Webpage display a text box for fragments to be inserts. Results displayed to screen. 

Check all repo samples (/validateAll): Webpage that updates Git repository and then reruns all schematron tests across files 
