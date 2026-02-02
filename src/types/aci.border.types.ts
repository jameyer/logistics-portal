export type ShipmentType = 'PARS' | 'INPARS';

export interface PortInfo {
    USPort:string;
    USPortName:string;
    portName: string;
    port: string;
    subLocation: string;
    releaseOffice: string;
}

export interface aciBaseBorderFilingType {
    proNumber: string;
    cnn: string;
    port: string;
    date: string;
    time: string;
}

export interface aciInParsBorderFilingType {
    subLocation: string;
    releaseOffice: string;
    date: string;
    time: string;
}
