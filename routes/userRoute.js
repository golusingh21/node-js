const express = require('express');
const userController = require('../controller/userController')
const router = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware");


/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users with their details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         description: The page number to retrieve. Starts from 1.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         description: The number of items per page.
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the user.
 *                         example: '66bb8c9b0108d07967342d61'
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                         example: 'Gulshan'
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                         example: 'gulshan@yuvasoftech.com'
 *                       password:
 *                         type: string
 *                         description: The hashed password of the user.
 *                         example: '$2b$10$xFkxy7GTjNRTyE0kijJ29etjxEp9siMvGADlcn9H7VNehLpDhNZ62'
 *                       __v:
 *                         type: integer
 *                         description: The version key, typically used by Mongoose.
 *                         example: 0
 *                 totalRecords:
 *                   type: number
 *                   description: Total no of records available in db
 *                   examaple: 5
 *       401: 
 *         description: unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/google-login', userController.googleLogin)
router.post('/login', userController.loginUser)
router.get('/', authMiddleware, userController.getAll)
router.post('/', userController.create)
router.delete('/:id', authMiddleware, userController.destroy)
router.get('/:id', authMiddleware, userController.details)
router.put('/:id', authMiddleware, userController.update)
router.post('/forgot-password', userController.forgotPassword)
router.post('/reset-password', userController.resetPassword)

module.exports = router;