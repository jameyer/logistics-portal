// src/schema/aci.base.schema.ts
import { z } from 'zod';

export const baseBorderSchema = z.object({
    proNumber: z.string().min(1, 'Shipment ID is required'),
    shipmentType: z.enum(['PARS', 'INPARS']),
    ccn: z.string().min(1, 'CCN is required'),
    date: z.string().min(1, 'date is required'),
    time: z.string().min(1, 'time is required'),
});
