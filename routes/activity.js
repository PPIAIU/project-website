const express = require('express');
const router = express.Router();
const activityController = require('../controllers/controllerActivity');
const { activityUpload } = require('../configs/upload');
const isAuth = require('../middlewares/isAuth');
const isValidObjectId = require('../middlewares/isValidObjectId');

// PDF Download Route (PUBLIC - no auth required)
router.get('/:id/pdf', isValidObjectId('/activity'), async (req, res) => {
    try {
        const Activity = require('../models/activity');
        const path = require('path');
        const fs = require('fs');
        
        const activity = await Activity.findById(req.params.id);
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        if (!activity.pdfFile || !activity.pdfFile.path) {
            return res.status(404).json({ 
                error: 'PDF not available for this activity',
                debug: {
                    title: activity.title,
                    category: activity.category,
                    hasPdfFile: !!activity.pdfFile,
                    pdfPath: activity.pdfFile?.path
                }
            });
        }
        
        // Handle both relative and absolute paths
        let filePath;
        if (activity.pdfFile.path.startsWith('/')) {
            // Path starts with /, it's relative to public folder
            filePath = path.join(__dirname, '../public', activity.pdfFile.path);
        } else {
            // Absolute path or relative to project root
            filePath = path.resolve(activity.pdfFile.path);
        }
        
        console.log('PDF download attempt:', {
            activityId: req.params.id,
            title: activity.title,
            pdfPath: activity.pdfFile.path,
            resolvedPath: filePath,
            fileExists: fs.existsSync(filePath)
        });
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                error: 'PDF file not found on server',
                debug: {
                    expectedPath: filePath,
                    pdfFileData: activity.pdfFile
                }
            });
        }
        
        // Set proper headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${activity.pdfFile.originalName || 'document.pdf'}"`);
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('PDF download error:', error);
        res.status(500).json({ 
            error: 'Failed to download PDF',
            debug: error.message 
        });
    }
});

// All OTHER routes require authentication (except PDF download)
router.use(isAuth);

// Index - Show all activities (admin)
router.get('/', activityController.index);

// New - Show form to create activity
router.get('/new', activityController.renderNewForm);

// Create - Handle activity creation
router.post('/', activityUpload.fields([
    { name: 'activity[image]', maxCount: 1 },
    { name: 'activity[pdfFile]', maxCount: 1 }
]), activityController.createActivity);

// Show - Display single activity
router.get('/:id', isValidObjectId('/activity'), activityController.showActivity);

// Edit - Show form to edit activity
router.get('/:id/edit', isValidObjectId('/activity'), activityController.renderEditForm);

// Update - Handle activity update
// Update - Handle activity update with method override support
router.put('/:id', isValidObjectId('/activity'), activityUpload.fields([
    { name: 'activity[image]', maxCount: 1 },
    { name: 'activity[pdfFile]', maxCount: 1 }
]), activityController.updateActivity);

// Handle POST with _method=PUT for form submissions
router.post('/:id', isValidObjectId('/activity'), activityUpload.fields([
    { name: 'activity[image]', maxCount: 1 },
    { name: 'activity[pdfFile]', maxCount: 1 }
]), (req, res, next) => {
    // Check if this is a PUT request disguised as POST
    if (req.body.activity && req.body.activity._method === 'PUT') {
        console.log('[MANUAL METHOD OVERRIDE] Converting POST to PUT');
        delete req.body.activity._method;
        return activityController.updateActivity(req, res, next);
    }
    next();
});

// Delete - Remove activity
router.delete('/:id', isValidObjectId('/activity'), activityController.deleteActivity);

// Toggle Active Status
router.post('/:id/toggle', isValidObjectId('/activity'), activityController.toggleActive);

// Debug: log routes (after all are defined)
setTimeout(() => {
    console.log('Activity routes registered:');
    router.stack.forEach(layer => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
            console.log(`  ${methods} ${layer.route.path}`);
        }
    });
}, 100);

module.exports = router;
