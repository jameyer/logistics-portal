
Logistics Portal

## Overview

In order to get a truck across the border from US to Canada, the following documentation is needed and how I handled it.

  ACI eManifest Lead Sheet with CRN Barcode - created in program.
  PARS/InPars with CCN Barcode -  created in program
  A8A - created in program.
  Commercial Invoice - Created pdf that says "Commercial Invoice.  In real world, this comes from imaging.
  BOL - Created BOL that says "Bill of Laden".  In real world, this comes from imaging.  I also added the CCN Barcode.

## Usage Notes 

scripts/faker.bol.create.js can be used to create 10 shipments or changed for more.  
For port information, I looked it up online, I used 3 ports only.  Both files are in src/data.

Once shipments and ports are added (which I've included in src/data), the program can be ran.

1st screen - 

chose PARS or INPARS.
chose a pro from the download.
CCN should be automatically created from the pro.  I chose 'TEST' as the SCAC Code.
Port can be chosen from dropdown.
Only manual part is adding the date/time.
Release Office and Sublocation are ONLY available on InPARS shipments.
You must choose InPARS if you want an A8A to be created.

2nd Screen - 

Documents are created on this screen with tabs across the top to verify correctness.  You may also print/download documents on this screen.
For PARS:
  Leadsheet
  BOL
  Commercial Invoice

For InPars:
  Leadsheet
  BOL
  Commercial Invoice
  A8A

3rd Screen - 
  
  Click the button to simulate sending the pdfs to an EDI provider.  If you wanted to save the pdfs, you can always click back and download.
  Clicking back will reset the screen to make it possible to simulate sending again.

  ## Reason for Program
    This answers the "WHY would anyone do this?"

    Customs was one of the systems I supported when I worked at Yellow/Roadway.  Creating the pdfs necessary had several touchpoints. When it went down, finding exactly where the issue was presented a challenge.  I think if data was entered, pdfs created and saved on the system - all by the same program, support would have been a lot easier.
  
  







 









