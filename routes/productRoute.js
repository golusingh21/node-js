const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

router.get('/', authMiddleware, productController.getAll);
router.get('/:id', authMiddleware, productController.details);
router.post('/', authMiddleware, upload.single('image'), productController.create);

module.exports = router;