const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

const verifyJWT = require('../middlewear/verifyJWT')
// router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)
    .post( usersController.createNewUser)
    .patch(verifyJWT, usersController.updateUser)
    .delete(verifyJWT ,usersController.deleteUser)

module.exports = router    
