const db = require('../config/db');

async function fixOrdersTable() {
    try {
        console.log('Checking orders table...');
        
        // Try to add the column. If it exists, this might fail or we can check first.
        // Easiest is to run ALTER TABLE and ignore "Duplicate column" error locally or check info schema.
        // But let's just try to add it.
        
        try {
            await db.execute(`ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(20) NOT NULL AFTER customer_name`);
            console.log('Added customer_phone column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column customer_phone already exists.');
            } else {
                console.log('Error adding column (might be okay if it exists):', err.message);
            }
        }
        
        // Also check customer_address if needed, but error only mentioned phone.
        // The migration had address too. Let's make sure.
         try {
            await db.execute(`ALTER TABLE orders ADD COLUMN customer_address TEXT NOT NULL AFTER customer_phone`);
             console.log('Added customer_address column (if it was missing).');
        } catch (err) {
             if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column customer_address already exists.');
            } else {
                 console.log('Error adding address column:', err.message);
            }
        }

        console.log('Fix completed.');
        process.exit();
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
}

fixOrdersTable();
