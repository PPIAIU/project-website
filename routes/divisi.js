

const express = require('express')
const validateDivisi = require('../middlewares/validateDivisi')
const router = express.Router()
const controllerDivisi = require('../controllers/controllerDivisi')
const wrapAsync = require('../utils/wrapAsync')
const validateMember = require('../middlewares/validateMember')

router.route('/:id')
.put( validateMember, wrapAsync(controllerDivisi.update) )
.delete( wrapAsync(controllerDivisi.destroy) )

router.get('/:periode_id/:divisi_id/show', controllerDivisi.show)
router.route('/edit', controllerDivisi.edit)

router.get('/:periode_id/create', wrapAsync(controllerDivisi.create) )

router.post('/:periode_id/store', validateDivisi, wrapAsync(controllerDivisi.store) )

module.exports = router