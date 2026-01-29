//  src/schema/aci.inpars.schema.ts
import { z } from 'zod';
import { baseBorderSchema } from '../schema/aci.base.schema';


export const inParsSchema = baseBorderSchema.extend({
    shipmentType: z.literal('INPARS'),
    subLocation: z.string().min(1, 'Sub Location is required'),
    releaseOffice: z.string().min(1, 'Release Office is required'),
    date: z.string().min(1, 'Date required'),
    time: z.string().min(1, 'time required'),
});
