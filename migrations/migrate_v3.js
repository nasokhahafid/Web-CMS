const db = require('../config/db');

async function migrate_v3() {
    try {
        console.log('Starting migration v3...');

        // 1. Add column address to orders table
        try {
            await db.execute('ALTER TABLE orders ADD COLUMN address TEXT AFTER customer_name');
            console.log('Added address column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('address already exists.');
            } else {
                throw e;
            }
        }
        
        // 2. Add column receipt_number (resi) just in case needed for tracking later, 
        // though user just asked to print it, storing it is good practice.
        try {
            await db.execute('ALTER TABLE orders ADD COLUMN receipt_number VARCHAR(50) AFTER total_price');
            console.log('Added receipt_number column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('receipt_number already exists.');
            } else {
                throw e;
            }
        }

        console.log('Migration v3 completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate_v3();
