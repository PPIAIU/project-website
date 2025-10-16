const BaseController = require('./BaseController');
const Activity = require('../models/activity');

// Create activity controller using base CRUD operations
const activityController = BaseController.createCRUDController(
    Activity, 
    'activity', 
    {
        populateFields: ['author'],
        sortBy: { order: 1, createdAt: -1 },
        fileField: 'image',
        redirectBase: '/activity'
    }
);

// Export all CRUD operations
module.exports = {
    index: activityController.index,
    renderNewForm: activityController.renderNewForm,
    createActivity: activityController.create,
    show: activityController.show,
    renderEditForm: activityController.renderEditForm,
    updateActivity: activityController.update,
    deleteActivity: activityController.delete
};