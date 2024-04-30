const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.get('/', productController.getAll);
router.get('/:id', productController.details);
router.post('/', productController.create);
router.put('/:id', productController.create);
router.delete('/:id', productController.create);

module.exports = router;