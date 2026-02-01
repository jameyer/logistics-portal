export interface crnFields {
    company: {
        posx: number;
        posy: number;
        value: string;
    };
    crn: {
        posx: number;
        posy: number;
        value: string;
    };
    barcode: {
        posx: number;
        posy: number;
        value: string;
    };
    portOfEntry: {
        port: {
            posx: number;
            posy: number;
            value: string;
        };
        portName: {
            posx: number;
            posy: number;
            value: string;
        };
    };

    truckNumber: {
        posx: number;
        posy: number;
        value: string;
    };
    truckLicense: {
        posx: number;
        posy: number;
        value: string;
    };
    trailerLicense: {
        posx: number;
        posy: number;
        value: string;
    };
    shipments: {
        shipment: {
            posx: number;
            posy: number;
            value: string;
        };
        type: {
            posx: number;
            posy: number;
            value: string;
        };
        transactionNumber: {
            posx: number;
            posy: number;
            value: string;
        };
        consignee: {
            posx: number;
            posy: number;
            value: string;
        };
    };
}
