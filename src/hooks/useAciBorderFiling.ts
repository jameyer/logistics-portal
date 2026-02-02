// src/hooks/useAciBorderFiling.ts
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inParsSchema } from '../schema/aci.inpars.schema';
import { ParsSchema } from '../schema/aci.pars.schema';
import type { ShipmentType } from '../types/aci.border.types';
import { useShipmentData } from './useShipmentData';
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
    const { shipments } = useShipmentData();
    const form = useForm<BorderFormValues>({
        resolver: zodResolver(masterBorderSchema),
        defaultValues: {
            shipmentType: initialType,
            // Set the first proNumber from your JSON as the default
            proNumber: shipments[0]?.proNumber || '',
        },
        mode: 'onChange',
    });

    const proNumberOptions = useMemo(
        () => shipments.map((b) => ({ value: b.proNumber, label: b.proNumber })),
        [shipments],
    );

    const portOptions = useMemo(() => PORT_INFO, []);

    return {
        form, // This is now strictly typed as UseFormReturn<BorderFormValues>
        proNumberOptions,
        portOptions,
    };
}
