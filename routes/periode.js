const express = require('express')
const router = express.Router()
const controllerPeriode = require('../controllers/controllerPeriode')


router.route('/')
    .get(controllerPeriode.index)
    
router.get('/show', controllerPeriode.)

module.exports = router