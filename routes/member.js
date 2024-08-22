
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')

router.route('/:id')
    .post(controllerMember.update)
    .delete(controllerMember.destroy)


router.get('/:periode_id/:divisi_id/create', controllerMember.create)
router.get('/:periode_id/:divisi_id/:member_id/show', controllerMember.show)

router.post('/:periode_id/:divisi_id/store', controllerMember.store)

router.get('/edit', controllerMember.edit)

module.exports = router

