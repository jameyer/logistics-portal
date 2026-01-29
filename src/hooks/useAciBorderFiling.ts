// src/hooks/useAciBorderFiling.ts
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { inParsSchema } from '../schema/aci.inpars.schema';
import { ParsSchema } from '../schema/aci.pars.schema';
import type { ShipmentType } from '../types/aci.border.types';
import bolData from '../assets/bol_data.json' with { type: 'json' };
import { PORT_INFO } from '../assets/ports';

const STORAGE_KEY = 'aci-border-filing';

const masterBorderSchema = z.discriminatedUnion('shipmentType', [
    ParsSchema,
    inParsSchema,
]);

export type BorderFormValues = z.input<typeof masterBorderSchema>;

function getSavedValues(initialType: ShipmentType): Partial<BorderFormValues> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { shipmentType: initialType };
        const parsed = JSON.parse(raw) as Partial<BorderFormValues>;
        if (!parsed.shipmentType) parsed.shipmentType = initialType;
        return parsed;
    } catch {
        return { shipmentType: initialType };
    }
}

export function useBorderForm(initialType: ShipmentType = 'PARS') {
    const form = useForm<BorderFormValues>({
        resolver: zodResolver(masterBorderSchema),
        defaultValues: getSavedValues(initialType),
    });

    const { control, reset } = form;
    const values = useWatch({ control });

    // Persist
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch (e) {
            console.error('Failed to persist ACI form', e);
        }
    }, [values]);

    // Optional: recompute defaults on mount
    useEffect(() => {
        reset(getSavedValues(initialType));
    }, [initialType, reset]);

    // Options derived once (or memoized if needed)
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
        form,
        proNumberOptions,
        portOptions,
    };
}
