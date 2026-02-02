import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useShipmentData } from '../hooks/useShipmentData';
import { useFormContext } from 'react-hook-form';
import {
    generateCoverSheet,
    generateBol,
    generateCommercialInvoice,
    generateA8A,
    type CrnFields
} from '../utils/pdfGenerator';
import type { BorderFormValues } from '../hooks/useAciBorderFiling';
import type { PortInfo } from '../types/aci.border.types';

type DocType = 'Cover Sheet' | 'Bill of Lading' | 'Commercial Invoice' | 'A8A';

interface AciDocumentsProps {
    portOptions: PortInfo[];
}

const AciDocuments = ({ portOptions }: AciDocumentsProps) => {
    const { getValues } = useFormContext<BorderFormValues>();
    const { getShipmentByProNumber } = useShipmentData();
    const [docUrls, setDocUrls] = useState<Record<string, string>>({});
    const [selectedDoc, setSelectedDoc] = useState<DocType>('Cover Sheet');

    // CHANGED: Store the actual error message, not just a flag
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const createAllDocs = async () => {
            try {
                const formData = getValues();
                const shipmentData = getShipmentByProNumber(formData.proNumber);

                if (!shipmentData) {
                    throw new Error(`CRITICAL: No BOL found for PRO Number "${formData.proNumber}". Check your mock data or the form input.`);
                }

                const selectedPort = portOptions.find(p => p.port === formData.port);

                const crnData: CrnFields = {
                    company: { value: "Test Company", posx: 50, posy: 700 },
                    crn: { value: formData.ccn, posx: 50, posy: 680 },
                    barcode: { value: formData.ccn, posx: 50, posy: 640 },
                    portOfEntry: {
                        port: { value: formData.port, posx: 300, posy: 700 },
                        portName: { value: selectedPort?.portName || '', posx: 350, posy: 700 }
                    },
                    truckNumber: { value: shipmentData.DriverInfo.truckNumber, posx: 50, posy: 600 },
                    truckLicense: { value: shipmentData.DriverInfo.truckLicenseNumber, posx: 150, posy: 600 },
                    trailerLicense: { value: shipmentData.DriverInfo.trailerLicenseNumber, posx: 250, posy: 600 },
                    shipments: {
                        shipment: { value: formData.ccn, posx: 50, posy: 550 },
                        type: { value: formData.shipmentType, posx: 100, posy: 550 },
                        transactionNumber: { value: "", posx: 200, posy: 550 },
                        consignee: { value: shipmentData.Consignee.name, posx: 400, posy: 550 }
                    }
                };

                const docPromises = [
                    generateCoverSheet(crnData),
                    generateBol(shipmentData),
                    generateCommercialInvoice(shipmentData),
                ];

                if (formData.shipmentType === 'INPARS') {
                    if (!selectedPort) {
                        throw new Error(`CRITICAL: No port found for port code "${formData.port}".`);
                    }
                    docPromises.push(generateA8A(shipmentData, selectedPort, formData as Extract<BorderFormValues, { shipmentType: 'INPARS' }>));
                }

                const [coverUrl, bolUrl, invUrl, a8aUrl] = await Promise.all(docPromises);

                const urls: Record<string, string> = {
                    'Cover Sheet': coverUrl,
                    'Bill of Lading': bolUrl,
                    'Commercial Invoice': invUrl,
                };

                if (a8aUrl) {
                    urls['A8A'] = a8aUrl;
                }

                setDocUrls(urls);
                setIsLoading(false);

            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : String(error);
                console.error("PDF GENERATION FAILURE:", error);
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
                        className={clsx(
                            'px-6 py-3 text-sm font-bold border-r border-slate-100 transition-colors',
                            {
                                'bg-blue-600 text-white': selectedDoc === docName,
                                'text-slate-600 hover:bg-slate-50': selectedDoc !== docName,
                            }
                        )}
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