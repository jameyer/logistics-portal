export type ShipmentType = 'PARS' | 'INPARS';

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
