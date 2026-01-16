const db = require('../config/db');

async function migrate_v5() {
    try {
        console.log('Starting migration v5...');

        // 1. Create vouchers table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS vouchers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(20) UNIQUE NOT NULL,
                discount_type ENUM('fixed', 'percentage') NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created vouchers table.');

        // 2. Add columns to orders table for tracking vouchers
        try {
            await db.execute('ALTER TABLE orders ADD COLUMN voucher_code VARCHAR(20) AFTER receipt_number');
            await db.execute('ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0 AFTER voucher_code');
            console.log('Added voucher columns to orders table.');
        } catch (e) {
            console.log('Voucher columns in orders table might already exist.');
        }

        console.log('Migration v5 completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate_v5();
