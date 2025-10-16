const Activity = require('../models/activity');
const path = require('path');
const fs = require('fs');

// Get all activities (for admin)
module.exports.index = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ order: 1, createdAt: -1 });
        res.render('activity/index', { activities });
    } catch (error) {
        req.flash('error_msg', 'Failed to load activities');
        res.redirect('/');
    }
};

// Show create form
module.exports.renderNewForm = (req, res) => {
    res.render('activity/new');
};

// Create new activity
module.exports.createActivity = async (req, res) => {
    try {
        console.log('=== CREATE ACTIVITY DEBUG ===');
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);
        
        // Convert checkbox values to Boolean for create
        const activityData = { ...req.body.activity };
        if (activityData.isActive !== undefined) {
            activityData.isActive = activityData.isActive === 'on' || activityData.isActive === 'true' || activityData.isActive === true;
        }
        
        const activity = new Activity(activityData);
        
        // Handle image upload
        if (req.files && req.files.image) {
            console.log('Image file found:', req.files.image[0].filename);
            activity.image = {
                filename: req.files.image[0].filename,
                path: '/image/' + req.files.image[0].filename
            };
        } else if (req.file) {
            // Fallback for single file upload
            console.log('Single file found:', req.file.filename);
            activity.image = {
                filename: req.file.filename,
                path: '/image/' + req.file.filename
            };
        }
        
        // Handle PDF upload for articles/journals
        const pdfFile = req.files && (req.files.pdfFile || req.files['activity[pdfFile]']);
        if (pdfFile) {
            console.log('PDF file found:', pdfFile[0].filename);
            activity.pdfFile = {
                filename: pdfFile[0].filename,
                path: '/pdf/' + pdfFile[0].filename,
                originalName: pdfFile[0].originalname,
                size: pdfFile[0].size,
                mimetype: pdfFile[0].mimetype
            };
            console.log('PDF file data set:', activity.pdfFile);
        } else {
            console.log('No PDF file found in req.files');
            console.log('Available files:', Object.keys(req.files || {}));
        }
        
        // Handle keywords array
        if (req.body.activity.keywords) {
            activity.keywords = req.body.activity.keywords.split(',').map(k => k.trim()).filter(k => k);
        }
        
        console.log('Activity before save:', {
            title: activity.title,
            category: activity.category,
            hasPdfFile: !!activity.pdfFile
        });
        
        await activity.save();
        console.log('Activity saved successfully');
        req.flash('success_msg', `Successfully created new ${activity.category}!`);
        res.redirect('/activity');
    } catch (error) {
        console.error('Error creating activity:', error);
        req.flash('error_msg', 'Failed to create activity: ' + error.message);
        res.redirect('/activity/new');
    }
};

// Show single activity
module.exports.showActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            req.flash('error_msg', 'Activity not found');
            return res.redirect('/activity');
        }
        res.render('activity/show', { activity });
    } catch (error) {
        req.flash('error_msg', 'Failed to load activity');
        res.redirect('/activity');
    }
};

// Show edit form
module.exports.renderEditForm = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            req.flash('error_msg', 'Activity not found');
            return res.redirect('/activity');
        }
        res.render('activity/edit', { activity });
    } catch (error) {
        req.flash('error_msg', 'Failed to load activity');
        res.redirect('/activity');
    }
};

// Update activity
module.exports.updateActivity = async (req, res) => {
    try {
        console.log('=== UPDATE ACTIVITY DEBUG ===');
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);
        
        const { id } = req.params;
        const activity = await Activity.findById(id);
        
        if (!activity) {
            req.flash('error_msg', 'Activity not found');
            return res.redirect('/activity');
        }
        
        // Update fields
        const updateData = { ...req.body.activity };
        
        // Convert checkbox values to Boolean
        if (updateData.isActive !== undefined) {
            updateData.isActive = updateData.isActive === 'on' || updateData.isActive === 'true' || updateData.isActive === true;
        }
        
        Object.assign(activity, updateData);
        
        // Handle new image upload
        const imageFile = req.files && (req.files.image || req.files['activity[image]']);
        if (imageFile) {
            console.log('New image file found:', imageFile[0].filename);
            // Delete old image if exists
            if (activity.image && activity.image.filename) {
                const oldImagePath = path.join(__dirname, '../public/image', activity.image.filename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // Set new image
            activity.image = {
                filename: imageFile[0].filename,
                path: '/image/' + imageFile[0].filename
            };
        }
        
        // Handle new PDF upload for articles/journals
        const pdfFile = req.files && (req.files.pdfFile || req.files['activity[pdfFile]']);
        if (pdfFile) {
            console.log('New PDF file found:', pdfFile[0].filename);
            // Delete old PDF if exists
            if (activity.pdfFile && activity.pdfFile.filename) {
                const oldPdfPath = path.join(__dirname, '../public/pdf', activity.pdfFile.filename);
                if (fs.existsSync(oldPdfPath)) {
                    fs.unlinkSync(oldPdfPath);
                }
            }
            
            // Set new PDF
            activity.pdfFile = {
                filename: pdfFile[0].filename,
                path: '/pdf/' + pdfFile[0].filename,
                originalName: pdfFile[0].originalname,
                size: pdfFile[0].size,
                mimetype: pdfFile[0].mimetype
            };
            console.log('PDF file data updated:', activity.pdfFile);
        }
        
        // Handle keywords array
        if (req.body.activity.keywords) {
            activity.keywords = req.body.activity.keywords.split(',').map(k => k.trim()).filter(k => k);
        }
        
        console.log('Activity before save:', {
            title: activity.title,
            category: activity.category,
            hasPdfFile: !!activity.pdfFile
        });
        
        await activity.save();
        console.log('Activity updated successfully');
        req.flash('success_msg', 'Successfully updated activity!');
        res.redirect(`/activity/${activity._id}`);
    } catch (error) {
        console.error('Error updating activity:', error);
        req.flash('error_msg', 'Failed to update activity');
        res.redirect(`/activity/${req.params.id}/edit`);
    }
};

// Delete activity
module.exports.deleteActivity = async (req, res) => {
    console.log('[DELETE] Controller called for activity:', req.params.id);
    try {
        const { id } = req.params;
        const activity = await Activity.findById(id);
        
        if (!activity) {
            console.log('[DELETE] Activity not found:', id);
            req.flash('error_msg', 'Activity not found');
            return res.redirect('/activity');
        }
        
        // Delete image file if exists
        if (activity.image && activity.image.filename) {
            const imagePath = path.join(__dirname, '../public/image', activity.image.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Activity.findByIdAndDelete(id);
        req.flash('success_msg', 'Successfully deleted activity');
        res.redirect('/activity');
    } catch (error) {
        console.error('Error deleting activity:', error);
        req.flash('error_msg', 'Failed to delete activity');
        res.redirect('/activity');
    }
};

// Toggle activity active status
module.exports.toggleActive = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            req.flash('error_msg', 'Activity not found');
            return res.redirect('/activity');
        }
        
        activity.isActive = !activity.isActive;
        await activity.save();
        
        req.flash('success_msg', `Activity ${activity.isActive ? 'activated' : 'deactivated'}`);
        res.redirect('/activity');
    } catch (error) {
        req.flash('error_msg', 'Failed to update activity status');
        res.redirect('/activity');
    }
};
