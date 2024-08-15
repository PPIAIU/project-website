
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')

router.route('/:id')
    .get(controllerMember.show)
    .post(controllerMember.update)
    .delete(controllerMember.destroy)

router.get('/create', controllerMember.create)
router.post('/:divisi_id/store', controllerMember.store)
router.get('/edit', controllerMember.edit)

module.exports = router

