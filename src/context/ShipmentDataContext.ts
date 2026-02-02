// src/context/ShipmentDataContext.ts
import { createContext } from 'react';
import type { Shipments, Shipment } from '../types/shipment.types';

export interface ShipmentDataContextType {
    shipments: Shipments;
    getShipmentByBolNumber: (bolNumber: string) => Shipment | undefined;
    getShipmentByProNumber: (proNumber: string) => Shipment | undefined;
}

export const ShipmentDataContext = createContext<ShipmentDataContextType | undefined>(undefined);
