// src/hooks/useAciBorderFiling.ts
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inParsSchema } from '../schema/aci.inpars.schema';
import { ParsSchema } from '../schema/aci.pars.schema';
import type { ShipmentType } from '../types/aci.border.types';
import bolData from '../assets/bol_data.json';
import { PORT_INFO } from '../assets/ports';
import { useMemo } from 'react';

const masterBorderSchema = z.discriminatedUnion('shipmentType', [
    ParsSchema,
    inParsSchema,
]);

export type BorderFormValues = z.input<typeof masterBorderSchema>;

export type BorderFormContextType = UseFormReturn<BorderFormValues>;

// Export the hook to be used in App.tsx
export function useBorderFormLogic(initialType: ShipmentType = 'PARS') {
    const form = useForm<BorderFormValues>({
        resolver: zodResolver(masterBorderSchema),
        defaultValues: { shipmentType: initialType }, // Simplified for brevity
        mode: 'onChange',
    });

    const proNumberOptions = useMemo(
        () => bolData.map((b) => ({ value: b.proNumber, label: b.proNumber })),
        [],
    );

    const portOptions = useMemo(
        () =>
            PORT_INFO.map((p) => ({
                value: p.port,
                label: p.portName,
                subLocation: p.subLocation,
                releaseOffice: p.releaseOffice,
            })),
        [],
    );

    return {
        form, // This is now strictly typed as UseFormReturn<BorderFormValues>
        proNumberOptions,
        portOptions,
    };
}
