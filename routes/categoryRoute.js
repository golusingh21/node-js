const express = require('express');
const router = express.Router()
const categoryController = require('../controller/categoryController');
const {authMiddleware} = require('../middleware/authMiddleware')

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.details);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);

module.exports = router;