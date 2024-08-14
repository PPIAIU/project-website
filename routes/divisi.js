

const express = require('express')

const router = express.Router()
const controllerDivisi = require('../controllers/controllerDivisi')

router.route('/:_id')
    .get( controllerDivisi.show)
    .put(controllerDivisi.update)
    .delete(controllerDivisi.destroy)

router.route('/edit', controllerDivisi.edit)

router.get('/create', controllerDivisi.create)

router.post('/:periode_id', controllerDivisi.store)

module.exports = router