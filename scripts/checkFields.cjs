// src/utils/checkFields.js
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const A8AFields = {
    usPort: {
        posx: 70,
        posy: 710,
        value: 'US Port',
    },
    manifestFrom: {
        posx: 70,
        posy: 690,
        value: 'ManifestFrom',
    },
    manifestTo: {
        posx: 190,
        posy: 690,
        value: 'ManifestTo',
    },
    Consignee: {
        posx: 70,
        posy: 668,
        value: 'Consignee',
    },
    Shipper: {
        posx: 70,
        posy: 618,
        value: 'Shipper',
    },
    acquittal: {
        posx: 325,
        posy: 725,
        value: 'Acquittal',
    },
    ccnBarcode: {
        posx: 350,
        posy: 675,
        value: 'CCN Barcode',
    },
    prevCCN: {
        posx: 350,
        posy: 608,
        value: 'Prev CCN',
    },
    noPkgs: {
        posx: 70,
        posy: 550,
        value: 'No Packages',
    },
    desc: {
        posx: 115,
        posy: 550,
        value: 'Description',
    },
    weight: {
        posx: 325,
        posy: 550,
        value: 'Weight',
    },
    foreignPOL: {
        posx: 70,
        posy: 450,
        value: 'Foreign POL',
    },
    locationOfGoods: {
        posx: 325,
        posy: 450,
        value: 'Location of Goods',
    },
    carrierName: {
        posx: 70,
        posy: 425,
        value: 'Carrier Name',
    },
    conveyanceId: {
        posx: 325,
        posy: 425,
        value: 'Conveyance ID',
    },
};









async function checkFields() {
  // 1. Define paths relative to this script
  const inputPath = path.join(__dirname, '../src/assets/A8A.pdf');
  const outputPath = path.join(__dirname, '../src/assets/A8A_check.pdf');

  // 2. Load the existing PDF
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  //const { width, height } = firstPage.getSize();

  // 3. Prepare font and colors
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  Object.entries(A8AFields).forEach(([, field]) => {
    firstPage.drawText(field.value, {
        x: field.posx,
        y: field.posy,
        size: 8,
        font: font, // Assumes you embedded the font earlier in the script
        color: rgb(0, 0, 0), // Black text
    });
});

  // 6. Save the new PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Grid PDF created at: ${outputPath}`);
}

checkFields().catch(err => console.error(err));