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
    const [revenue] = await db.execute('SELECT SUM(total_price) as total FROM orders');
    
    // Chart Data: Sales Last 7 Days
    const [salesData] = await db.execute(`
        SELECT DATE_FORMAT(order_date, '%Y-%m-%d') as date, SUM(total_price) as total 
        FROM orders 
        WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        GROUP BY DATE_FORMAT(order_date, '%Y-%m-%d')
        ORDER BY date ASC
    `);

    // Chart Data: Top Products
    const [topProducts] = await db.execute(`
        SELECT product_name, SUM(quantity) as qty 
        FROM orders 
        GROUP BY product_name 
        ORDER BY qty DESC 
        LIMIT 5
    `);

    res.render('admin/dashboard', {
        counts: {
            products: productsCount[0].count,
            gallery: galleryCount[0].count,
            testimonials: testiCount[0].count,
            revenue: revenue[0].total || 0
        },
        chart: {
            sales: salesData,
            products: topProducts
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
    req.flash('success', 'Produk berhasil ditambahkan!');
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
    req.flash('success', 'Produk berhasil dihapus!');
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
    req.flash('success', 'Foto berhasil ditambahkan ke galeri!');
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
    await db.execute("INSERT INTO testimonials (customer_name, review, rating, status) VALUES (?, ?, ?, 'approved')", 
        [customer_name, review, rating]);
    req.flash('success', 'Testimoni berhasil ditambahkan!');
    res.redirect('/admin/testimonials');
};

exports.approveTestimonial = async (req, res) => {
    await db.execute("UPDATE testimonials SET status = 'approved' WHERE id = ?", [req.params.id]);
    req.flash('success', 'Testimoni disetujui!');
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
    req.flash('success', 'Konten website berhasil diperbarui!');
    res.redirect('/admin/content');
};

// Settings
exports.getSettings = async (req, res) => {
    const [settings] = await db.execute('SELECT * FROM settings LIMIT 1');
    res.render('admin/settings', { setting: settings[0] || {} });
};

exports.postUpdateSettings = async (req, res) => {
    const { wa_number, instagram, address, google_analytics_id, facebook_pixel_id } = req.body;
    const [rows] = await db.execute('SELECT id FROM settings LIMIT 1');
    if (rows.length > 0) {
        await db.execute('UPDATE settings SET wa_number = ?, instagram = ?, address = ?, google_analytics_id = ?, facebook_pixel_id = ? WHERE id = ?', 
            [wa_number, instagram, address, google_analytics_id, facebook_pixel_id, rows[0].id]);
    } else {
        await db.execute('INSERT INTO settings (wa_number, instagram, address, google_analytics_id, facebook_pixel_id) VALUES (?, ?, ?, ?, ?)', 
            [wa_number, instagram, address, google_analytics_id, facebook_pixel_id]);
    }

    req.flash('success', 'Pengaturan berhasil disimpan!');
    res.redirect('/admin/settings');
};

exports.postChangePassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;
    
    if (new_password !== confirm_password) {
        req.flash('error', 'Konfirmasi password baru tidak cocok!');
        return res.redirect('/admin/settings');
    }

    try {
        const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [req.session.admin.id]);
        if (rows.length > 0) {
            const match = await bcrypt.compare(current_password, rows[0].password);
            if (!match) {
                req.flash('error', 'Password lama salah!');
                return res.redirect('/admin/settings');
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            await db.execute('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.session.admin.id]);
            req.flash('success', 'Password berhasil diubah!');
        }
    } catch (err) {
        console.error(err);
        req.flash('error', 'Terjadi kesalahan sistem.');
    }
    res.redirect('/admin/settings');
};

// Orders Management (Bookkeeping)
exports.getOrders = async (req, res) => {
    const [orders] = await db.execute('SELECT * FROM orders ORDER BY order_date DESC, created_at DESC');
    const [products] = await db.execute('SELECT * FROM products WHERE is_active = 1');
    const [vouchers] = await db.execute('SELECT * FROM vouchers WHERE is_active = 1');
    res.render('admin/orders', { orders, products, vouchers });
};

exports.postAddOrder = async (req, res) => {
    const { customer_name, address, product_name, quantity, total_price, receipt_number, voucher_code, discount_amount, order_date, notes } = req.body;
    await db.execute('INSERT INTO orders (customer_name, address, product_name, quantity, total_price, receipt_number, voucher_code, discount_amount, order_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [customer_name, address, product_name, quantity, total_price, receipt_number, voucher_code, discount_amount, order_date, notes]);
    req.flash('success', 'Order baru berhasil dicatat!');
    res.redirect('/admin/orders');
};

exports.deleteOrder = async (req, res) => {
    await db.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.redirect('/admin/orders');
};

exports.getPrintReceipt = async (req, res) => {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.redirect('/admin/orders');
    // Get settings for header info
    const [settings] = await db.execute('SELECT * FROM settings LIMIT 1');
    res.render('admin/print_receipt', { order: orders[0], setting: settings[0] || {}, type: 'receipt' });
};

exports.getPrintLabel = async (req, res) => {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.redirect('/admin/orders');
    const [settings] = await db.execute('SELECT * FROM settings LIMIT 1');
    res.render('admin/print_label', { order: orders[0], setting: settings[0] || {} });
};

// Vouchers
exports.getVouchers = async (req, res) => {
    const [vouchers] = await db.execute('SELECT * FROM vouchers ORDER BY created_at DESC');
    res.render('admin/vouchers', { vouchers });
};

exports.postAddVoucher = async (req, res) => {
    const { code, discount_type, discount_value } = req.body;
    await db.execute('INSERT INTO vouchers (code, discount_type, discount_value) VALUES (?, ?, ?)', 
        [code.toUpperCase(), discount_type, discount_value]);
    req.flash('success', 'Voucher berhasil dibuat!');
    res.redirect('/admin/vouchers');
};

exports.deleteVoucher = async (req, res) => {
    await db.execute('DELETE FROM vouchers WHERE id = ?', [req.params.id]);
    req.flash('success', 'Voucher telah dihapus!');
    res.redirect('/admin/vouchers');
};
