const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Activity title is required'],
        trim: true
    },
    tagline: {
        type: String,
        required: [true, 'Activity tagline is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Activity description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['academic', 'social', 'sports', 'culture']
    },
    subCategory: {
        type: String,
        required: false,
        enum: ['activity', 'article', 'journal', 'research']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: [
            'Department of Education and Culture',
            'Department of Youth and Sports',
            'Department of Strategic Research',
            'Department of Organizational Development and Advocacy',
            'Department of Media and Communication',
            'External Events',
            'Badan Pengurus Harian'
        ]
    },
    departmentIcon: {
        type: String,
        default: 'fas fa-users',
        enum: [
            'fas fa-users', 'fas fa-graduation-cap', 'fas fa-sitemap', 'fas fa-microphone',
            'fas fa-handshake', 'fas fa-heart', 'fas fa-trophy', 'fas fa-briefcase',
            'fas fa-comments', 'fas fa-lightbulb', 'fas fa-book', 'fas fa-award'
        ]
    },
    image: {
        filename: String,
        path: String
    },
    placeholderIcon: {
        type: String,
        default: 'fas fa-calendar'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Article/Journal specific fields
    articleContent: {
        type: String,
        default: null
    },
    pdfFile: {
        filename: String,
        path: String,
        originalName: String,
        size: Number,
        mimetype: String
    },
    author: {
        type: String,
        default: null
    },
    publishDate: {
        type: Date,
        default: null
    },
    abstract: {
        type: String,
        default: null
    },
    keywords: [{
        type: String
    }],
    references: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before save
activitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for checking if activity has image
activitySchema.virtual('hasImage').get(function() {
    return this.image && this.image.filename;
});

module.exports = mongoose.model('Activity', activitySchema);
