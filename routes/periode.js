const express = require('express')
const controllerPeriode = require('../controllers/controllerPeriode')
const wrapAsync = require('../utils/wrapAsync')
const validatePeriode = require('../middlewares/validatePeriode')
const router = express.Router()
const isValidObjectId = require('../middlewares/isValidObjectId')


router.route('/')
    .get(wrapAsync(controllerPeriode.index))
    .post( isValidObjectId('/periode'), validatePeriode, wrapAsync( controllerPeriode.store) )

router.get('/create', controllerPeriode.create)

router.get('/:id/edit', isValidObjectId('/periode'),  wrapAsync(controllerPeriode.edit))


router.route('/:id')
    .get( isValidObjectId('/periode'), wrapAsync(controllerPeriode.show) )
    .put( isValidObjectId('/periode'), wrapAsync( validatePeriode, controllerPeriode.update) )
    
router.delete('/:id', wrapAsync(controllerPeriode.destroy)  )

module.exports = router
