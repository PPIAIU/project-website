const express = require('express')
const router = express.Router()
const Activity = require('../models/activity')

router.get('/', async (req, res) => {
    try {
        // Fetch active activities sorted by order then creation date
        const activities = await Activity.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
        
        // If no activities in database, render static page with sample content
        if (activities.length === 0) {
            res.render('blog/index-clean', { activities: [] })
        } else {
            res.render('blog/index', { activities })
        }
    } catch (err) {
        console.error('Error fetching activities:', err)
        req.flash('error_msg', 'Failed to load activities')
        // Fallback to static page
        res.render('blog/index-clean', { activities: [] })
    }
})


module.exports = router