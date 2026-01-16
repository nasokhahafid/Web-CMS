const db = require('../config/db');

async function migrate_v4() {
    try {
        console.log('Starting migration v4...');

        // Add 'status' column to testimonials table for moderation
        try {
            await db.execute("ALTER TABLE testimonials ADD COLUMN status ENUM('pending', 'approved') DEFAULT 'approved' AFTER rating");
            console.log('Added status column to testimonials.');
            
            // Note: I set default to 'approved' for existing ones, but for new public subs it will be 'pending' in controller logic or default.
            // Actually, let's set it to 'approved' for now so current ones don't disappear.
            await db.execute("UPDATE testimonials SET status = 'approved'");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('status already exists.');
            } else {
                throw e;
            }
        }

        console.log('Migration v4 completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate_v4();
