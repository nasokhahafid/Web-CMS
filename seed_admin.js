const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
    try {
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Cek apakah admin sudah ada
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
        
        if (rows.length === 0) {
            console.log('User admin tidak ditemukan. Membuat user admin baru...');
            await db.execute('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash]);
            console.log('SUCCESS: Admin user created!');
            console.log('Username: admin');
            console.log('Password: admin123');
        } else {
            console.log('User admin sudah ada. Memperbarui password...');
            await db.execute('UPDATE admins SET password = ? WHERE username = ?', [hash, 'admin']);
            console.log('SUCCESS: Admin password reset!');
            console.log('Username: admin');
            console.log('Password: admin123');
        }
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        process.exit();
    }
}

seedAdmin();
