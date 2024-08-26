

const express = require('express')
const validateDivisi = require('../middlewares/validateDivisi')
const isValidObjectId = require('../middlewares/isValidObjectId')
const router = express.Router()
const controllerDivisi = require('../controllers/controllerDivisi')
const wrapAsync = require('../utils/wrapAsync')
const validateMember = require('../middlewares/validateMember')

router.route('/:id')
.put( isValidObjectId('/periode'), validateMember, wrapAsync(controllerDivisi.update) )
.delete( wrapAsync(controllerDivisi.destroy) )

router.get('/:periode_id/:divisi_id/show', isValidObjectId('/periode'),  controllerDivisi.show)
router.get('/edit', controllerDivisi.edit)

router.get('/:periode_id/create', isValidObjectId('/periode'), wrapAsync(controllerDivisi.create) )

router.post('/:periode_id/store', isValidObjectId('/periode'), validateDivisi, wrapAsync(controllerDivisi.store) )

module.exports = router