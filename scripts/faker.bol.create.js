import { faker, fakerEN_CA } from '@faker-js/faker';
import fs from 'fs';

const generateStaticBOLs = (count = 10) => {
    const bols = [];

    for (let i = 0; i < count; i++) {
        bols.push({
            date: faker.date.recent().toLocaleDateString(),
            bolNumber: `BL-${faker.string.alphanumeric(10).toUpperCase()}`,
            proNumber: `${faker.string.numeric(10)}`, // This will be your search key
            trailerNumber: faker.vehicle.vrm(),
            Shipper: {
                name: faker.company.name(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state({ abbreviated: true }),
                zip: faker.location.zipCode(),
            },
            Consignee: {
                name: fakerEN_CA.company.name(),
                address: fakerEN_CA.location.streetAddress(),
                city: fakerEN_CA.location.city(),
                state: fakerEN_CA.location.state({ abbreviated: true }),
                zip: fakerEN_CA.location.zipCode(),
            },
            Contact: {
                name: faker.person.fullName(),
                phone: faker.phone.number(),
            },
            ShipmentDetails: {
                shippingUnits: faker.number.int({ min: 1, max: 20 }).toString(),
                package: faker.number.int({ min: 1, max: 5 }).toString(),
                unitOfMeasure: 'PCS',
                hazmat: faker.helpers.arrayElement(['Y', 'N']),
                description: faker.commerce.productName(),
                nmfc: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1, max: 9 })}`,
                class: faker.helpers.arrayElement(['50', '70', '92.5']),
                weight: faker.number.int({ min: 100, max: 5000 }).toString(),
                dimensions: {
                    length: faker.number.int({ min: 20, max: 120 }).toString(),
                    width: faker.number.int({ min: 20, max: 100 }).toString(),
                    height: faker.number.int({ min: 20, max: 100 }).toString(),
                },
            },
            DriverInfo: {
                name: faker.person.fullName(),
                dob: faker.date
                    .birthdate({ min: 21, max: 65, mode: 'age' })
                    .toLocaleDateString(),
                truckNumber: faker.number
                    .int({ min: 10000, max: 99999 })
                    .toString(),
                truckLicenseNumber: `${faker.vehicle.vrm()}  (${faker.location.state({ abbreviated: true })})`,
                trailerNumber: faker.number
                    .int({ min: 10000, max: 99999 })
                    .toString(),
                trailerLicenseNumber: `${faker.vehicle.vrm()}  (${faker.location.state({ abbreviated: true })})`,
            },
        });
    }

    fs.writeFileSync(
        './src/data/bol_data.json',
        JSON.stringify(bols, null, 2),
    );
    console.log('✅ bol_data.json updated to match Shipment interface.');
};

generateStaticBOLs(10);
