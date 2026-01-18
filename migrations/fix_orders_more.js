const db = require('../config/db');

async function fixOrdersTableMore() {
    try {
        console.log('Checking orders table for more missing columns...');
        
        // Add total_amount
        try {
            await db.execute(`ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER customer_address`);
            console.log('Added total_amount column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column total_amount already exists.');
            } else {
                console.log('Error adding total_amount column:', err.message);
            }
        }
        
        // Add status
         try {
            await db.execute(`ALTER TABLE orders ADD COLUMN status ENUM('pending', 'paid', 'completed', 'cancelled') DEFAULT 'pending' AFTER total_amount`);
             console.log('Added status column.');
        } catch (err) {
             if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column status already exists.');
            } else {
                 console.log('Error adding status column:', err.message);
            }
        }

        console.log('Fix completed.');
        process.exit();
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
}

fixOrdersTableMore();
