const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { check } = require('express-validator')

const { GetAllUsers, GetOneUser, RegisterUser, LoginUser, LogoutUser, ModifyUser, DeleteOneUser } = require('../controllers/user.controllers')

router.post('/register', [
    check('nombre', 'Campo Nombre Vacio').notEmpty(),
    check('apellido', 'Campo Apellido Vacio').notEmpty(),
    check('email', 'Campo Email Vacio').notEmpty(),
    check('email', 'Formato de Email incorrecto').isEmail(),
    check('contrasenia', 'Campo Contrasenia Vacio').notEmpty(),
    check('contrasenia', 'Campo Contrasenia: +8 Caracteres').isLength({ min: 8 })
], RegisterUser)
router.post('/login', [
    check('email', 'Campo Email Vacio').notEmpty(),
    check('email', 'Formato de Email incorrecto').isEmail(),
    check('contrasenia', 'Campo Contrasenia Vacio').isEmpty(),
    check('contrasenia', 'Campo Contrasenia: +8 Caracteres').isLength({ min: 8 })
], LoginUser)
router.get('/logout', auth(['admin', 'user']), LogoutUser)

router.get('/', auth('admin'), GetAllUsers)
router.get('/:id', auth('admin'), GetOneUser)
router.put('/modify/:id', auth('admin'), ModifyUser)
router.delete('/delete/:id', auth('admin'), DeleteOneUser)

module.exports = router;