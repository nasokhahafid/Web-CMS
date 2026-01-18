const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getLandingPage);
router.post('/testimonial', publicController.postTestimonial);
router.post('/checkout', publicController.postCheckout);
router.get('/sitemap.xml', publicController.getSitemap);
router.get('/robots.txt', publicController.getRobots);

module.exports = router;
