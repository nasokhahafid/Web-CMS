const db = require('../config/db');

async function migrate() {
    try {
        console.log('Starting migration v2...');

        // 1. Create orders table
        console.log('Creating orders table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                customer_name VARCHAR(100) NOT NULL,
                product_name VARCHAR(100),
                quantity INT DEFAULT 1,
                total_price DECIMAL(10, 2) NOT NULL,
                order_date DATE NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Orders table created.');

        // 2. Add columns to settings table
        // We check if columns exist first or just try to add and ignore error if dup column (or use safer check)
        // Since MariaDB/MySQL doesn't support "ADD COLUMN IF NOT EXISTS" cleanly in all versions without procedure,
        // we'll try to select the column. If it fails (or checks schema), we add.
        // Easiest "lazy" way: Try ADD, catch error if it says Duplicate column name.
        
        console.log('Updating settings table...');
        try {
            await db.execute('ALTER TABLE settings ADD COLUMN google_analytics_id VARCHAR(50)');
            console.log('Added google_analytics_id column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('google_analytics_id already exists.');
            } else {
                throw e;
            }
        }

        try {
            await db.execute('ALTER TABLE settings ADD COLUMN facebook_pixel_id VARCHAR(50)');
            console.log('Added facebook_pixel_id column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('facebook_pixel_id already exists.');
            } else {
                throw e;
            }
        }

        console.log('Migration v2 completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
