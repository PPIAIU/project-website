
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')
const Member = require('../models/member')
const Divisi = require('../models/divisi')

router.post('/',)

router.get('/create', controllerMember.create)

module.exports = router

