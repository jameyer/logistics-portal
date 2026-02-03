// src/context/ShipmentDataProvider.tsx
import type { ReactNode } from 'react';
import type { Shipments } from '../types/shipment.types';
import BOL_DATA from '../data/bol_data.json';
import { ShipmentDataContext } from './ShipmentDataContext';

export const ShipmentDataProvider = ({ children }: { children: ReactNode }) => {
  const shipments = BOL_DATA as Shipments;

  const getShipmentByBolNumber = (bolNumber: string) => {
    return shipments.find(shipment => shipment.bolNumber === bolNumber);
  };

  const getShipmentByProNumber = (proNumber: string) => {
    return shipments.find(shipment => shipment.proNumber === proNumber);
  };

  return (
    <ShipmentDataContext.Provider value={{ shipments, getShipmentByBolNumber, getShipmentByProNumber }}>
      {children}
    </ShipmentDataContext.Provider>
  );
};
