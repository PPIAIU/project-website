const express = require('express')
const controllerPeriode = require('../controllers/controllerPeriode')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router()

router.route('/')
    .get(wrapAsync(controllerPeriode.index))
    .post( wrapAsync(controllerPeriode.store) )

router.get('/create', wrapAsync(controllerPeriode.create))

router.get('/:id/edit', wrapAsync(controllerPeriode.edit))


router.route('/:id')
    .get( controllerPeriode.show)
    .put(controllerPeriode.update)
    
router.delete('/:id',controllerPeriode.destroy)
module.exports = router
