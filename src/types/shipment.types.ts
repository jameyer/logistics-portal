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
        package: string;
        unitOfMeasure: string;
        hazmat: string;
        description: string;
        nmfc: string;
        class: string;
        weight: string;
        dimensions: {
            length: string;
            width: string;
            height: string;
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
