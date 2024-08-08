const express = require('express');
const router = express.Router()
const categoryController = require('../controller/categoryController');
const {authMiddleware} = require('../middleware/authMiddleware')

router.get('/', authMiddleware, categoryController.getAll);
router.get('/:id', authMiddleware, categoryController.details);
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);

module.exports = router;