const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Public Admin Routes
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected Admin Routes
router.use(auth);
router.get('/dashboard', adminController.getDashboard);

// Products
router.get('/products', adminController.getProducts);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.post('/products/update', upload.single('image'), adminController.postUpdateProduct);
router.get('/products/delete/:id', adminController.deleteProduct);

// Gallery
router.get('/gallery', adminController.getGallery);
router.post('/gallery/add', upload.single('image'), adminController.postAddGallery);
router.get('/gallery/delete/:id', adminController.deleteGallery);

// Testimonials
router.get('/testimonials', adminController.getTestimonials);
router.post('/testimonials/add', adminController.postAddTestimonial);
router.get('/testimonials/delete/:id', adminController.deleteTestimonial);

// Content
router.get('/content', adminController.getContent);
router.post('/content/update', adminController.postUpdateContent);

// Settings
router.get('/settings', adminController.getSettings);
router.post('/settings/update', adminController.postUpdateSettings);

module.exports = router;
