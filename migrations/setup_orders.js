const db = require('../config/db');

async function createOrderTables() {
    try {
        console.log('Creating orders table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                customer_name VARCHAR(100) NOT NULL,
                customer_phone VARCHAR(20) NOT NULL,
                customer_address TEXT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Creating order_items table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                order_id INT,
                product_name VARCHAR(100),
                quantity INT,
                price DECIMAL(10, 2),
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            );
        `);

        console.log('Tables created successfully.');
        process.exit();
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createOrderTables();
