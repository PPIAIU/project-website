const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const controllerAuth = require('../controllers/controllerAuth')
const passport = require('passport')

router.route('/login')
.get(controllerAuth.loginForm)
.post(passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg',
        msg: 'Username or password is incorrect'
    },
    successFlash: true

    }), controllerAuth.login)
    
    
router.post('/logout', controllerAuth.logout)

module.exports =  router