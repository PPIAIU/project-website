
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')
const wrapAsync = require('../utils/wrapAsync')
const validateMember = require('../middlewares/validateMember')
const isAuth = require('../middlewares/isAuth')
const  isValidObjectId  = require('../middlewares/isValidObjectId')
const upload = require('../configs/uploadMember')

router.route('/:id')
    .delete( isAuth, wrapAsync(controllerMember.destroy) )
    .put( isAuth, upload.single('image'), validateMember, wrapAsync(controllerMember.update))

router.get('/:periode_id/:divisi_id/create', isAuth, wrapAsync(controllerMember.create) )
router.get('/:periode_id/:divisi_id/:member_id/show', isValidObjectId('/periode'), wrapAsync(controllerMember.show)  )
router.get('/:periode_id/:divisi_id/:member_id/edit', isAuth, isValidObjectId('/periode'), wrapAsync(controllerMember.edit) )

router.post('/:periode_id/:divisi_id/store', isAuth, upload.single('image'), validateMember,  wrapAsync(controllerMember.store) )


module.exports = router

