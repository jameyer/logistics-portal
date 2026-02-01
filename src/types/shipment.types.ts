// src/types/shipment.types.ts
export interface Shipment {
    date: string;
    bolNumber: string;
    proNumber: string;
    trailerNumber: string;
    Shipper: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    Consignee: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    Contact: {
        name: string;
        phone: string;
    };
    ShipmentDetails: {
        shippingUnits: string;
        package: number;
        unitOfMeasure: string;
        hazmat: boolean;
        description: string;
        nmfc: string;
        class: string;
        weight: string;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
    };
    DriverInfo: {
        name: string;
        dob: string;
        truckNumber: string;
        truckLicenseNumber: string;
        trailerNumber: string;
        trailerLicenseNumber: string;
    };
}

export type Shipments = Shipment[];
