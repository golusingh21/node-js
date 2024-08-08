const express = require('express');
const userController = require('../controller/userController')
const router = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware")

router.post('/login', userController.loginUser)
router.get('/', authMiddleware, userController.getAll)
router.post('/', userController.create)
router.delete('/:id', authMiddleware, userController.destroy)
router.get('/:id', authMiddleware, userController.details)
router.put('/:id', authMiddleware, userController.update)

module.exports = router;