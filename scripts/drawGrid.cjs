// src/utils/drawGrid.js
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function drawGrid() {
  // 1. Define paths relative to this script
  const inputPath = path.join(__dirname, '../src/assets/A8A.pdf');
  const outputPath = path.join(__dirname, '../src/assets/A8A_with_grid.pdf');

  // 2. Load the existing PDF
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // 3. Prepare font and colors
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const gridColorX = rgb(0.7, 0.9, 0.7); // Light green for X
  const gridColorY = rgb(0.8, 0.8, 0.8); // Light gray for Y
  const textColor = rgb(0.5, 0.5, 0.5);
  const step = 25; // Grid spacing in points

  // 4. Draw vertical lines (X-axis)
  for (let x = 0; x <= width; x += step) {
    firstPage.drawLine({
      start: { x, y: 0 },
      end: { x, y: height },
      thickness: .5,
      color: gridColorX,
    });

    firstPage.drawText(x.toString(), {
      x: x + 2,
      y: 5,
      size: 8,
      font,
      color: textColor,
    });
  }

  // 5. Draw horizontal lines (Y-axis)
  for (let y = 0; y <= height; y += step) {
    firstPage.drawLine({
      start: { x: 0, y },
      end: { x: width, y },
      thickness: .5,
      color: gridColorY,
    });

    firstPage.drawText(y.toString(), {
      x: 5,
      y: y + 2,
      size: 8,
      font,
      color: textColor,
    });
  }

  // 6. Save the new PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Grid PDF created at: ${outputPath}`);
}

drawGrid().catch(err => console.error(err));