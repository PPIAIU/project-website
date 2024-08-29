

const express = require('express')
const validateDivisi = require('../middlewares/validateDivisi')
const isValidObjectId = require('../middlewares/isValidObjectId')
const router = express.Router()
const controllerDivisi = require('../controllers/controllerDivisi')
const wrapAsync = require('../utils/wrapAsync')
const validateMember = require('../middlewares/validateMember')
const isAuth = require('../middlewares/isAuth')


router.route('/:id')
.delete( isAuth, wrapAsync(controllerDivisi.destroy) )
.put( isValidObjectId('/periode'), isAuth, validateDivisi, wrapAsync(controllerDivisi.update) )

router.get('/:periode_id/:divisi_id/show', isValidObjectId('/periode'),  controllerDivisi.show)
router.get('/:divisi_id/edit',  isAuth, isValidObjectId('/periode'), controllerDivisi.edit)

router.get('/:periode_id/create', isAuth, isValidObjectId('/periode'), wrapAsync(controllerDivisi.create) )

router.post('/:periode_id/store', isAuth, isValidObjectId('/periode'), validateDivisi, wrapAsync(controllerDivisi.store) )

module.exports = router