const db = require('../config/db');

exports.getLandingPage = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE is_active = 1');
        const [contents] = await db.execute('SELECT * FROM contents');
        const [gallery] = await db.execute('SELECT * FROM gallery');
        const [testimonials] = await db.execute("SELECT * FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC");
        const [settings] = await db.execute('SELECT * FROM settings LIMIT 1');

        // Transform contents index
        const contentMap = {};
        contents.forEach(item => contentMap[item.section_name] = item);

        res.render('public/index', {
            products,
            content: contentMap,
            gallery,
            testimonials,
            setting: settings[0] || {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getSitemap = async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${req.protocol}://${req.get('host')}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`);
};

exports.getRobots = (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /admin/
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
};

exports.postTestimonial = async (req, res) => {
    try {
        const { customer_name, review, rating } = req.body;
        // Default to pending for public submissions
        await db.execute("INSERT INTO testimonials (customer_name, review, rating, status) VALUES (?, ?, ?, 'pending')", 
            [customer_name, review, rating]);
        
        // We don't have flash on public side yet, maybe just redirect with query param or just simple message
        res.redirect('/?submitted=1#testi');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};

exports.postCheckout = async (req, res) => {
    console.log('Received Checkout Request:', req.body); // Debugging
    try {
        const { customer_name, customer_phone, customer_address, cart } = req.body;
        
        if (!customer_name || !cart || cart.length === 0) {
            console.error('Validation Invalid:', req.body);
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        let total_amount = 0;
        if (Array.isArray(cart)) {
            total_amount = cart.reduce((sum, item) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.qty) || 1;
                return sum + (price * qty);
            }, 0);
        }

        console.log('Calculated Total:', total_amount);

        // Insert Order
        // Note: 'orders' table has legacy columns 'total_price' (no default) and 'order_date' (no default).
        // we must supply them. We also supply 'total_amount' which is our new column.
        const [orderResult] = await db.execute(
            "INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, total_price, order_date, status) VALUES (?, ?, ?, ?, ?, NOW(), 'paid')", 
            [customer_name, customer_phone || '', customer_address || '', total_amount, total_amount]
        );
        
        const orderId = orderResult.insertId;

        // Insert Items
        if (Array.isArray(cart)) {
            for (const item of cart) {
                await db.execute(
                    "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)",
                    [orderId, item.product, item.qty, Number(item.price) || 0]
                );
            }
        }
        
        console.log('Order Saved Successfully:', orderId);
        res.json({ success: true, message: 'Order created successfully' });
    } catch (error) {
        console.error('Checkout Error Stack:', error);
        res.status(500).json({ success: false, message: 'Failed to create order: ' + error.message });
    }
};
