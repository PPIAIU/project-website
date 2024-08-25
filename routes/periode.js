const express = require('express')
const controllerPeriode = require('../controllers/controllerPeriode')
const wrapAsync = require('../utils/wrapAsync')
const validatePeriode = require('../middlewares/validatePeriode')
const router = express.Router()

router.route('/')
    .get(wrapAsync(controllerPeriode.index))
    .post(validatePeriode, wrapAsync( controllerPeriode.store) )

router.get('/create', controllerPeriode.create)

router.get('/:id/edit',  wrapAsync(controllerPeriode.edit))


router.route('/:id')
    .get(wrapAsync(controllerPeriode.show) )
    .put( wrapAsync( validatePeriode, controllerPeriode.update) )
    
router.delete('/:id', wrapAsync(controllerPeriode.destroy)  )

module.exports = router
