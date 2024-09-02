const express = require('express')
const controllerPeriode = require('../controllers/controllerPeriode')
const wrapAsync = require('../utils/wrapAsync')
const validatePeriode = require('../middlewares/validatePeriode')
const router = express.Router()
const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isAuth')
const upload = require('../configs/uploadPeriode')


router.route('/')
    .get(wrapAsync(controllerPeriode.index))
    .post( isAuth, upload.array('image', 1), validatePeriode, wrapAsync( controllerPeriode.store) )
 

router.get('/create',  isAuth, controllerPeriode.create)

router.get('/:id/edit', isAuth, isValidObjectId('/periode'),  wrapAsync(controllerPeriode.edit))


router.route('/:id')
    .get( isValidObjectId('/periode'), wrapAsync(controllerPeriode.show) )
    .put( isValidObjectId('/periode'), isAuth, upload.array('image', 1), validatePeriode, wrapAsync( controllerPeriode.update) )
    
router.delete('/:id', isAuth, wrapAsync(controllerPeriode.destroy)  )

module.exports = router
