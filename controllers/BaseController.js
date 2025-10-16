/* ========================================
   BASE CONTROLLER - Eliminate Redundancy
   Common functions for all controllers
   ======================================== */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

class BaseController {
    /**
     * Handle async errors and render error page
     */
    static wrapAsync(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    /**
     * Common error handler for all controllers
     */
    static handleError(res, error, message = 'An error occurred', redirectPath = '/') {
        console.error(error);
        res.flash('error_msg', message);
        res.redirect(redirectPath);
    }

    /**
     * Common success handler
     */
    static handleSuccess(res, message, redirectPath = '/') {
        res.flash('success_msg', message);
        res.redirect(redirectPath);
    }

    /**
     * Validate ObjectId
     */
    static isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    /**
     * Handle file upload (common for image/pdf uploads)
     */
    static handleFileUpload(req, fileField = 'image') {
        if (req.files && req.files[fileField]) {
            return {
                filename: req.files[fileField][0].filename,
                path: req.files[fileField][0].path
            };
        }
        return null;
    }

    /**
     * Delete file from filesystem
     */
    static deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
        return false;
    }

    /**
     * Convert checkbox values to boolean
     */
    static processCheckboxFields(data, fields = ['isActive']) {
        const processed = { ...data };
        fields.forEach(field => {
            if (processed[field] !== undefined) {
                processed[field] = processed[field] === 'on' || 
                                processed[field] === 'true' || 
                                processed[field] === true;
            }
        });
        return processed;
    }

    /**
     * Standard CRUD operations generator
     */
    static createCRUDController(Model, viewPath, options = {}) {
        const {
            populateFields = [],
            sortBy = { createdAt: -1 },
            fileField = 'image',
            redirectBase = '/'
        } = options;

        return {
            // List all items
            index: this.wrapAsync(async (req, res) => {
                try {
                    let query = Model.find();
                    if (populateFields.length > 0) {
                        populateFields.forEach(field => {
                            query = query.populate(field);
                        });
                    }
                    const items = await query.sort(sortBy);
                    res.render(`${viewPath}/index`, { items });
                } catch (error) {
                    this.handleError(res, error, `Failed to load ${viewPath}`, redirectBase);
                }
            }),

            // Show create form
            renderNewForm: (req, res) => {
                res.render(`${viewPath}/new`);
            },

            // Create new item
            create: this.wrapAsync(async (req, res) => {
                try {
                    const itemData = this.processCheckboxFields(req.body[viewPath] || req.body);
                    const item = new Model(itemData);
                    
                    // Handle file upload
                    const file = this.handleFileUpload(req, fileField);
                    if (file) {
                        item[fileField] = file;
                    }
                    
                    // Set author if user is logged in
                    if (req.user) {
                        item.author = req.user._id;
                    }
                    
                    await item.save();
                    this.handleSuccess(res, `${viewPath} created successfully!`, redirectBase);
                } catch (error) {
                    this.handleError(res, error, `Failed to create ${viewPath}`, `${redirectBase}/new`);
                }
            }),

            // Show single item
            show: this.wrapAsync(async (req, res) => {
                try {
                    const { id } = req.params;
                    if (!this.isValidObjectId(id)) {
                        return this.handleError(res, new Error('Invalid ID'), 'Invalid item ID', redirectBase);
                    }
                    
                    let query = Model.findById(id);
                    if (populateFields.length > 0) {
                        populateFields.forEach(field => {
                            query = query.populate(field);
                        });
                    }
                    
                    const item = await query;
                    if (!item) {
                        return this.handleError(res, new Error('Not found'), `${viewPath} not found`, redirectBase);
                    }
                    
                    res.render(`${viewPath}/show`, { item });
                } catch (error) {
                    this.handleError(res, error, `Failed to load ${viewPath}`, redirectBase);
                }
            }),

            // Show edit form
            renderEditForm: this.wrapAsync(async (req, res) => {
                try {
                    const { id } = req.params;
                    if (!this.isValidObjectId(id)) {
                        return this.handleError(res, new Error('Invalid ID'), 'Invalid item ID', redirectBase);
                    }
                    
                    const item = await Model.findById(id);
                    if (!item) {
                        return this.handleError(res, new Error('Not found'), `${viewPath} not found`, redirectBase);
                    }
                    
                    res.render(`${viewPath}/edit`, { item });
                } catch (error) {
                    this.handleError(res, error, `Failed to load ${viewPath}`, redirectBase);
                }
            }),

            // Update item
            update: this.wrapAsync(async (req, res) => {
                try {
                    const { id } = req.params;
                    if (!this.isValidObjectId(id)) {
                        return this.handleError(res, new Error('Invalid ID'), 'Invalid item ID', redirectBase);
                    }
                    
                    const itemData = this.processCheckboxFields(req.body[viewPath] || req.body);
                    
                    // Handle file upload for update
                    const file = this.handleFileUpload(req, fileField);
                    if (file) {
                        // Delete old file if exists
                        const oldItem = await Model.findById(id);
                        if (oldItem && oldItem[fileField] && oldItem[fileField].path) {
                            this.deleteFile(oldItem[fileField].path);
                        }
                        itemData[fileField] = file;
                    }
                    
                    const item = await Model.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
                    if (!item) {
                        return this.handleError(res, new Error('Not found'), `${viewPath} not found`, redirectBase);
                    }
                    
                    this.handleSuccess(res, `${viewPath} updated successfully!`, `${redirectBase}/${id}`);
                } catch (error) {
                    this.handleError(res, error, `Failed to update ${viewPath}`, `${redirectBase}/${req.params.id}/edit`);
                }
            }),

            // Delete item
            delete: this.wrapAsync(async (req, res) => {
                try {
                    const { id } = req.params;
                    if (!this.isValidObjectId(id)) {
                        return this.handleError(res, new Error('Invalid ID'), 'Invalid item ID', redirectBase);
                    }
                    
                    const item = await Model.findById(id);
                    if (!item) {
                        return this.handleError(res, new Error('Not found'), `${viewPath} not found`, redirectBase);
                    }
                    
                    // Delete associated file
                    if (item[fileField] && item[fileField].path) {
                        this.deleteFile(item[fileField].path);
                    }
                    
                    await Model.findByIdAndDelete(id);
                    this.handleSuccess(res, `${viewPath} deleted successfully!`, redirectBase);
                } catch (error) {
                    this.handleError(res, error, `Failed to delete ${viewPath}`, redirectBase);
                }
            })
        };
    }
}

module.exports = BaseController;