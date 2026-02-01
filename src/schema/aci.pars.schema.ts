// src/schema/aci.pars.schema.ts
import { z } from 'zod';
import { baseBorderSchema } from '../schema/aci.base.schema';

export const ParsSchema = baseBorderSchema.extend({
    shipmentType: z.literal('PARS'),
    
});