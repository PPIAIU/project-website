
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')
const wrapAsync = require('../utils/wrapAsync')
const validateMember = require('../middlewares/validateMember')
router.route('/:id')
    .post( validateMember, wrapAsync(controllerMember.update) )
    .delete( wrapAsync(controllerMember.destroy) )


router.get('/:periode_id/:divisi_id/create', wrapAsync(controllerMember.create) )
router.get('/:periode_id/:divisi_id/:member_id/show', wrapAsync(controllerMember.show)  )

router.post('/:periode_id/:divisi_id/store',validateMember, wrapAsync(controllerMember.store) )

router.get('/edit', wrapAsync(controllerMember.edit) )

module.exports = router

