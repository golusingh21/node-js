const express = require('express');
const userController = require('../controller/userController')
const router = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware")

router.post('/login', userController.loginUser)
router.get('/', authMiddleware, userController.getAll)
router.post('/', userController.create)
router.delete('/:id', userController.destroy)
router.get('/:id', userController.details)
router.put('/:id', userController.update)

module.exports = router;