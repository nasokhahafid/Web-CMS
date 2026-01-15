const db = require('../config/db');
const bcrypt = require('bcrypt');

// Auth
exports.getLogin = (req, res) => {
    if (req.session.admin) return res.redirect('/admin/dashboard');
    res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length > 0) {
            const match = await bcrypt.compare(password, rows[0].password);
            if (match) {
                req.session.admin = rows[0];
                return res.redirect('/admin/dashboard');
            }
        }
        res.render('admin/login', { error: 'Username atau Password salah!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};

// Dashboard
exports.getDashboard = async (req, res) => {
    const [productsCount] = await db.execute('SELECT COUNT(*) as count FROM products');
    const [galleryCount] = await db.execute('SELECT COUNT(*) as count FROM gallery');
    const [testiCount] = await db.execute('SELECT COUNT(*) as count FROM testimonials');
    
    res.render('admin/dashboard', {
        counts: {
            products: productsCount[0].count,
            gallery: galleryCount[0].count,
            testimonials: testiCount[0].count
        }
    });
};

// Products Management
exports.getProducts = async (req, res) => {
    const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.render('admin/products', { products });
};

exports.postAddProduct = async (req, res) => {
    const { name, description, spicy_level, price } = req.body;
    const image = req.file ? req.file.filename : null;
    await db.execute('INSERT INTO products (name, description, spicy_level, price, image) VALUES (?, ?, ?, ?, ?)', 
        [name, description, spicy_level, price, image]);
    res.redirect('/admin/products');
};

exports.postUpdateProduct = async (req, res) => {
    const { id, name, description, spicy_level, price } = req.body;
    let query = 'UPDATE products SET name = ?, description = ?, spicy_level = ?, price = ? WHERE id = ?';
    let params = [name, description, spicy_level, price, id];
    
    if (req.file) {
        query = 'UPDATE products SET name = ?, description = ?, spicy_level = ?, price = ?, image = ? WHERE id = ?';
        params = [name, description, spicy_level, price, req.file.filename, id];
    }
    await db.execute(query, params);
    res.redirect('/admin/products');
};

exports.deleteProduct = async (req, res) => {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.redirect('/admin/products');
};

// Gallery Management
exports.getGallery = async (req, res) => {
    const [gallery] = await db.execute('SELECT * FROM gallery ORDER BY created_at DESC');
    res.render('admin/gallery', { gallery });
};

exports.postAddGallery = async (req, res) => {
    const title = req.body.title;
    const image = req.file ? req.file.filename : null;
    await db.execute('INSERT INTO gallery (title, image) VALUES (?, ?)', [title, image]);
    res.redirect('/admin/gallery');
};

exports.deleteGallery = async (req, res) => {
    await db.execute('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.redirect('/admin/gallery');
};

// Testimonials Management
exports.getTestimonials = async (req, res) => {
    const [testimonials] = await db.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.render('admin/testimonials', { testimonials });
};

exports.postAddTestimonial = async (req, res) => {
    const { customer_name, review, rating } = req.body;
    await db.execute('INSERT INTO testimonials (customer_name, review, rating) VALUES (?, ?, ?)', 
        [customer_name, review, rating]);
    res.redirect('/admin/testimonials');
};

exports.deleteTestimonial = async (req, res) => {
    await db.execute('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.redirect('/admin/testimonials');
};

// Content Management
exports.getContent = async (req, res) => {
    const [contents] = await db.execute('SELECT * FROM contents');
    res.render('admin/content', { contents });
};

exports.postUpdateContent = async (req, res) => {
    const { id, title, content } = req.body;
    await db.execute('UPDATE contents SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    res.redirect('/admin/content');
};

// Settings
exports.getSettings = async (req, res) => {
    const [settings] = await db.execute('SELECT * FROM settings LIMIT 1');
    res.render('admin/settings', { setting: settings[0] || {} });
};

exports.postUpdateSettings = async (req, res) => {
    const { wa_number, instagram, address } = req.body;
    const [rows] = await db.execute('SELECT id FROM settings LIMIT 1');
    if (rows.length > 0) {
        await db.execute('UPDATE settings SET wa_number = ?, instagram = ?, address = ? WHERE id = ?', 
            [wa_number, instagram, address, rows[0].id]);
    } else {
        await db.execute('INSERT INTO settings (wa_number, instagram, address) VALUES (?, ?, ?)', 
            [wa_number, instagram, address]);
    }
    res.redirect('/admin/settings');
};
