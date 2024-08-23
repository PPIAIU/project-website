

const express = require('express')

const router = express.Router()
const controllerDivisi = require('../controllers/controllerDivisi')

router.route('/:id')
.put(controllerDivisi.update)
.delete(controllerDivisi.destroy)

router.get('/:periode_id/:divisi_id/show', controllerDivisi.show)
router.route('/edit', controllerDivisi.edit)

router.get('/:periode_id/create', controllerDivisi.create)

router.post('/:periode_id/store', controllerDivisi.store)

module.exports = router