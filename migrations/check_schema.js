const db = require('../config/db');

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE orders');
        console.log('Orders Table Schema:', rows);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
