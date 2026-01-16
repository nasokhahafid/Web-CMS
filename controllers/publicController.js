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
