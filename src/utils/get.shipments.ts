// src/utils/get.shipments.ts

import type { Shipments } from '../types/shipment.types';

const getShipments = async (): Promise<Shipments> => {
    try {
        const shipments = await fetch('http://localhost:3000/api/bols/');
        const data = await shipments.json();
        console.log(data);
        return data;
    } catch (errors) {
        console.error('unable to load shipments', errors);
        throw errors;
    }
};

export default getShipments;

