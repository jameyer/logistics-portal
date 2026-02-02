// src/hooks/useShipmentData.ts
import { useContext } from 'react';
import { ShipmentDataContext } from '../context/ShipmentDataContext';

export const useShipmentData = () => {
    const context = useContext(ShipmentDataContext);
    if (context === undefined) {
        throw new Error('useShipmentData must be used within a ShipmentDataProvider');
    }
    return context;
};
