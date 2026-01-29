import { v4 as uuidv4 } from 'uuid';



export const generateCargoControlNumber = (carrierCode = 'TEST'): string => {
    const uniqueId = uuidv4().replace(/-/g, '').substring(0, 10);
    return `${carrierCode}${uniqueId.toUpperCase()}`;
};


