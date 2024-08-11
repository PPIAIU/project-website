
const express = require('express')
const router = express.Router()
const controllerMember = require('../controllers/controllerMember')

const Member = require('../models/member')

router.route('/')
    .get(  )

router.get('/create', controllerMember.create)

module.exports = router