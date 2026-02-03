# Logistics Portal

## Overview

This application simulates the documentation workflow required to transport freight across the US-Canada border. In a real-world scenario, documents often come from several sources (imaging systems, manual entry, legacy databases). This project combines data entry and PDF generation into a single process.

It handles the creation of the following required documents:

- **ACI eManifest Lead Sheet:** Includes the CRN Barcode.
- **PARS/InPARS:** Includes the CCN Barcode.
- **A8A:** Required for InPARS shipments.
- **Commercial Invoice:** Generated as a standard PDF (simulating an imaged document).
- **Bill of Lading (BOL):** Generated with the appended CCN Barcode (simulating an imaged document).

## Motivation

I supported customs at Yellow/Roadway. The original process for creating these PDFs involved several steps/systems. When outages occurred, identifying the point of failure was difficult.

I built this application to demonstrate that entering data, generating PDFs, and saving records within a single program simplifies support and improves reliability.

## Setup and Data

- **Shipment Data:** Run `scripts/faker.bol.create.js` to generate dummy shipment data. It defaults to 10 shipments but can be modified.
- **Port Data:** Port information is stored in `src/data`. This project currently uses 3 specific ports for demonstration purposes.

## Workflow

### Step 1: Shipment Entry

The initial screen handles shipment classification and data entry:

1.  **Select Type:** Choose **PARS** (Pre-arrival Review System) or **InPARS** (In-bond Pre-arrival Review System).
2.  **Select Pro:** Choose a Pro number from the downloaded data.
3.  **CCN Generation:** The Cargo Control Number (CCN) generates automatically from the Pro number using the SCAC code 'TEST'.
4.  **Port Selection:** Select the crossing port from the dropdown.
5.  **Release Office & Sublocation:** These fields appear only if **InPARS** is selected.
6.  **Date/Time:** Manually enter the estimated arrival details.

**Note:** You must select **InPARS** to trigger A8A document creation.

### Step 2: Document Verification

This screen provides a tabbed view to verify the generated PDFs. You can view, print, or download the documents here.

**PARS Documents:**

- Leadsheet
- BOL
- Commercial Invoice

**InPARS Documents:**

- Leadsheet
- BOL
- Commercial Invoice
- A8A

### Step 3: EDI Simulation

- Click the simulation button to mimic sending the PDFs to an EDI provider.
- If you need to save the PDFs locally, use the **Back** button to return to the previous screen and download them.
- Clicking **Back** resets the workflow, allowing you to run the simulation again.
