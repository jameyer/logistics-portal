import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import { toCanvas } from '@bwip-js/browser';
import type { Shipment } from '../types/shipment.types';
import { v4 as uuidv4 } from 'uuid';
import A8A from '../assets/A8A.pdf';
import { A8ALAYOUT } from '../constants/A8ALayout';

// --- Interfaces ---
export interface FieldCoord {
    posx: number;
    posy: number;
    value: string;
}

export interface CrnFields {
    company: FieldCoord;
    crn: FieldCoord;
    barcode: FieldCoord;
    portOfEntry: {
        port: FieldCoord;
        portName: FieldCoord;
    };
    truckNumber: FieldCoord;
    truckLicense: FieldCoord;
    trailerLicense: FieldCoord;
    shipments: {
        shipment: FieldCoord;
        type: FieldCoord;
        transactionNumber: FieldCoord;
        consignee: FieldCoord;
    };
}

// --- Helpers ---
function getUUIDCode() {
    // Generate UUID, remove all non-digits, then take the first 6
    const code = uuidv4().replace(/\D/g, '').substring(0, 6);

    // Pad with random numbers if the UUID didn't have enough digits
    return code.padEnd(6, Math.floor(Math.random() * 10).toString());
}
// --- Layout Helpers ---

// Auto-centers text horizontally
function drawCenteredText(
    page: PDFPage,
    text: string,
    font: PDFFont,
    size: number,
    y: number,
) {
    const textWidth = font.widthOfTextAtSize(text, size);
    const { width: pageWidth } = page.getSize();

    page.drawText(text, {
        x: (pageWidth - textWidth) / 2,
        y: y,
        size: size,
        font: font,
        color: rgb(0, 0, 0),
    });
}

// Draws the bordered headers (like "Truck and Trailer Information")
function drawSectionHeader(
    page: PDFPage,
    text: string,
    font: PDFFont,
    y: number,
) {
    const { width: pageWidth } = page.getSize();
    const margin = 50;
    const boxHeight = 20;

    // Draw Box
    page.drawRectangle({
        x: margin,
        y: y,
        width: pageWidth - margin * 2,
        height: boxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    // Draw Text Centered in Box
    // y + 6 gives a rough vertical center alignment for size 10 font
    drawCenteredText(page, text, font, 10, y + 6);
}

async function createBarcode(text: string): Promise<string> {
    const canvas = document.createElement('canvas');
    try {
        toCanvas(canvas, {
            bcid: 'code128',
            text: text,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.error('Barcode generation failed', e);
        return '';
    }
}

function createPdfUrl(pdfBytes: Uint8Array): string {
    const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
    });
    return URL.createObjectURL(blob);
}

// --- Generators ---

export async function generateCoverSheet(data: CrnFields): Promise<string> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { width } = page.getSize();
    const crnGen = getUUIDCode();
    const crnNumber = `TEST00CRN${crnGen}`;

    // 1. Main Header
    drawCenteredText(page, 'ACI eManifest for Canada', font, 18, 750);

    // 2. Company & CRN
    drawCenteredText(page, `Company: ${data.company.value}`, bold, 12, 720);
    drawCenteredText(
        page,
        `Conveyance Reference Number: ${crnNumber}`,
        bold,
        12,
        700,
    );

    // 3. Barcode (Centered)
    if (data.barcode.value) {
        const barcodeUrl = await createBarcode(crnNumber);
        if (barcodeUrl) {
            const pngImageBytes = await fetch(barcodeUrl).then((res) =>
                res.arrayBuffer(),
            );
            const barcodeImg = await doc.embedPng(pngImageBytes);
            const dims = barcodeImg.scale(0.5);

            page.drawImage(barcodeImg, {
                x: (width - dims.width) / 2, // Center math
                y: 640,
                width: dims.width,
                height: dims.height,
            });
        }
    }

    // 4. Port
    drawCenteredText(
        page,
        `Port of Entry: ${data.portOfEntry.port.value}: ${data.portOfEntry.portName.value}`,
        bold,
        12,
        600,
    );

    // 5. Truck Section
    const truckY = 570;
    drawSectionHeader(page, 'Truck and Trailer Information', bold, truckY);

    drawCenteredText(
        page,
        `Truck Number: ${data.truckNumber.value}`,
        bold,
        10,
        truckY - 20,
    );
    drawCenteredText(
        page,
        `Truck License Plate: ${data.truckLicense.value}`,
        bold,
        10,
        truckY - 35,
    );
    drawCenteredText(
        page,
        `Trailer License Plate(s): ${data.trailerLicense.value}`,
        bold,
        10,
        truckY - 50,
    );

    // 6. Shipments Section
    const shipY = 480;
    drawSectionHeader(page, 'Shipments', bold, shipY);

    // Table Headers
    const tableY = shipY - 15;
    page.drawText('Shipment', { x: 50, y: tableY, size: 10, font: bold });
    page.drawText('Type', { x: 200, y: tableY, size: 10, font: bold });
    page.drawText('Transaction Number', {
        x: 300,
        y: tableY,
        size: 10,
        font: bold,
    });
    page.drawText('Consignee', { x: 450, y: tableY, size: 10, font: bold });

    // Table Row (Loop this if you have multiple shipments)
    const rowY = tableY - 15;
    page.drawText(data.shipments.shipment.value, {
        x: 50,
        y: rowY,
        size: 10,
        font,
    });
    page.drawText(data.shipments.type.value, {
        x: 200,
        y: rowY,
        size: 10,
        font,
    });
    page.drawText(data.shipments.transactionNumber.value, {
        x: 300,
        y: rowY,
        size: 10,
        font,
    });
    page.drawText(data.shipments.consignee.value, {
        x: 450,
        y: rowY,
        size: 10,
        font,
    });

    const pdfBytes = await doc.save();
    return createPdfUrl(pdfBytes);
}

export async function generateBol(shipment: Shipment): Promise<string> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    page.drawText('BILL OF LADING', {
        x: 50,
        y: height - 50,
        size: 20,
        font: bold,
    });

    page.drawText(`SHIPPER: ${shipment.Shipper.name}`, {
        x: 50,
        y: height - 100,
        size: 10,
        font,
    });
    page.drawText(`CONSIGNEE: ${shipment.Consignee.name}`, {
        x: 300,
        y: height - 100,
        size: 10,
        font,
    });

    const parsText = shipment.proNumber;
    const barcodeUrl = await createBarcode(parsText);
    if (barcodeUrl) {
        const pngImageBytes = await fetch(barcodeUrl).then((res) =>
            res.arrayBuffer(),
        );
        const barcodeImg = await doc.embedPng(pngImageBytes);
        const dims = barcodeImg.scale(0.5);

        page.drawText('PARS / PRO NUMBER:', {
            x: 400,
            y: height - 50,
            size: 8,
            font: bold,
        });
        page.drawImage(barcodeImg, {
            x: 400,
            y: height - 90,
            width: dims.width,
            height: dims.height,
        });
    }

    const pdfBytes = await doc.save();
    return createPdfUrl(pdfBytes);
}

export async function generateCommercialInvoice(
    shipment: Shipment,
): Promise<string> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    page.drawText('COMMERCIAL INVOICE', {
        x: 50,
        y: height - 50,
        size: 20,
        font: bold,
    });

    const yStart = height - 150;
    page.drawText('Description', { x: 50, y: yStart, size: 12, font: bold });
    page.drawText('Weight', { x: 300, y: yStart, size: 12, font: bold });
    page.drawText('Value', { x: 450, y: yStart, size: 12, font: bold });

    page.drawText(shipment.ShipmentDetails.description, {
        x: 50,
        y: yStart - 20,
        size: 10,
        font,
    });
    page.drawText(`${shipment.ShipmentDetails.weight} LBS`, {
        x: 300,
        y: yStart - 20,
        size: 10,
        font,
    });
    page.drawText('$10,000.00', { x: 450, y: yStart - 20, size: 10, font });

    const pdfBytes = await doc.save();
    return createPdfUrl(pdfBytes);
}

export async function generateA8A(shipment: Shipment): Promise<string> {
    const existingPdfBytes = await fetch(A8A).then((res) => res.arrayBuffer());
    const doc = await PDFDocument.load(existingPdfBytes);
    const pages = doc.getPages();
    const page = pages[0];
    const font = await doc.embedFont(StandardFonts.Helvetica);
    Object.entries(A8ALAYOUT).forEach(([key, field]) => {
        console.log(`${key} ${shipment.Contact}`);

        page.drawText(field.value, {
            x: field.posx,
            y: field.posy,
            size: 8,
            font: font,
            color: rgb(0, 0, 0),
        });
    });

    const pdfBytes = await doc.save();
    return createPdfUrl(pdfBytes);
}
