const db = require('../config/db');

exports.getLandingPage = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE is_active = 1');
        const [contents] = await db.execute('SELECT * FROM contents');
        const [gallery] = await db.execute('SELECT * FROM gallery');
        const [testimonials] = await db.execute('SELECT * FROM testimonials');
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
