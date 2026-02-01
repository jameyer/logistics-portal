
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    generateCoverSheet,
    generateBol,
    generateCommercialInvoice,
    generateA8A,
    type CrnFields
} from '../utils/pdfGenerator';
import type { BorderFormValues } from '../hooks/useAciBorderFiling';
import type { Shipment } from '../types/shipment.types';

// MOCK DATA - Replace with your actual import logic
const BOL_DATA: Shipment[] = [
    {
        date: "2026-02-01",
        bolNumber: "BOL123",
        proNumber: "0673356093",
        trailerNumber: "TRL555",
        Shipper: { name: "Acme Corp", address: "123 Ind St", city: "Toronto", state: "ON", zip: "M5V 2T6" },
        Consignee: { name: "Widget Inc", address: "456 Biz Rd", city: "Buffalo", state: "NY", zip: "14202" },
        Contact: { name: "John Doe", phone: "555-1234" },
        ShipmentDetails: {
            shippingUnits: "10", package: 10, unitOfMeasure: "PLT", hazmat: false, description: "Widgets", nmfc: "12345", class: "50", weight: "1000",
            dimensions: { length: 48, width: 40, height: 50 }
        },
        DriverInfo: { name: "Jane Driver", dob: "1980-01-01", truckNumber: "101", truckLicenseNumber: "LIC123", trailerNumber: "TRL555", trailerLicenseNumber: "TRL-LIC" }
    }
];

type DocType = 'Cover Sheet' | 'Bill of Lading' | 'Commercial Invoice' | 'A8A';

const AciDocuments = () => {
    const { getValues } = useFormContext<BorderFormValues>();
    const [docUrls, setDocUrls] = useState<Record<string, string>>({});
    const [selectedDoc, setSelectedDoc] = useState<DocType>('Cover Sheet');

    // CHANGED: Store the actual error message, not just a flag
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const createAllDocs = async () => {
            try {
                const formData = getValues();
                const shipmentData = BOL_DATA.find(s => s.proNumber === formData.proNumber);

                // 1. Explicitly trap missing data
                if (!shipmentData) {
                    throw new Error(`CRITICAL: No BOL found for PRO Number "${formData.proNumber}". Check your mock data or the form input.`);
                }

                const crnData: CrnFields = {
                    company: { value: "My Logistics Co", posx: 50, posy: 700 },
                    crn: { value: formData.ccn, posx: 50, posy: 680 },
                    barcode: { value: formData.ccn, posx: 50, posy: 640 },
                    portOfEntry: {
                        port: { value: formData.port, posx: 300, posy: 700 },
                        portName: { value: "Port Name Lookup", posx: 350, posy: 700 }
                    },
                    truckNumber: { value: shipmentData.DriverInfo.truckNumber, posx: 50, posy: 600 },
                    truckLicense: { value: shipmentData.DriverInfo.truckLicenseNumber, posx: 150, posy: 600 },
                    trailerLicense: { value: shipmentData.DriverInfo.trailerLicenseNumber, posx: 250, posy: 600 },
                    shipments: {
                        shipment: { value: "1", posx: 50, posy: 550 },
                        type: { value: formData.shipmentType, posx: 100, posy: 550 },
                        transactionNumber: { value: formData.ccn, posx: 200, posy: 550 },
                        consignee: { value: shipmentData.Consignee.name, posx: 400, posy: 550 }
                    }
                };

                const [coverUrl, bolUrl, invUrl, a8aUrl] = await Promise.all([
                    generateCoverSheet(crnData),
                    generateBol(shipmentData),
                    generateCommercialInvoice(shipmentData),
                    generateA8A(shipmentData)
                ]);

                setDocUrls({
                    'Cover Sheet': coverUrl,
                    'Bill of Lading': bolUrl,
                    'Commercial Invoice': invUrl,
                    'A8A': a8aUrl
                });
                setIsLoading(false);

            } catch (error: unknown) {
                // 2. Capture the real error message
                const msg = error instanceof Error ? error.message : String(error);
                console.error("PDF GENERATION FAILURE:", error); // Keep this for stack trace
                setErrorMessage(msg);
                setIsLoading(false);
            }
        };

        createAllDocs();

        return () => {
            Object.values(docUrls).forEach(url => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. Display the actual error on screen
    if (errorMessage) {
        return (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Generation Failed: </strong>
                <span className="block sm:inline">{errorMessage}</span>
                <p className="mt-2 text-sm text-slate-600">Check the inputs on the previous step or the console for a full stack trace.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="font-bold text-slate-600">Generating PDFs...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[800px] border border-slate-300 rounded-lg overflow-hidden bg-slate-100">
            <div className="flex border-b border-slate-300 bg-white">
                {(Object.keys(docUrls) as DocType[]).map((docName) => (
                    <button
                        key={docName}
                        onClick={() => setSelectedDoc(docName)}
                        className={`px-6 py-3 text-sm font-bold border-r border-slate-100 transition-colors ${selectedDoc === docName
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {docName}
                    </button>
                ))}

                <div className="flex-1 flex justify-end items-center px-4">
                    <a
                        href={docUrls[selectedDoc]}
                        download={`${selectedDoc.replace(/\s+/g, '_')}.pdf`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase"
                    >
                        Download Current
                    </a>
                </div>
            </div>

            <div className="flex-1 p-4">
                <iframe
                    src={docUrls[selectedDoc]}
                    className="w-full h-full rounded shadow-md bg-white"
                    title="Document Preview"
                />
            </div>
        </div>
    );
};

export default AciDocuments;