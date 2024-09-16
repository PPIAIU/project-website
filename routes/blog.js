const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('blog/index')
})


module.exports = router