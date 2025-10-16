const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Unified Upload Configuration - No Redundancy
 * Handles all file uploads (images, PDFs, etc.)
 */

class UploadConfig {
    constructor() {
        this.baseUploadDir = path.join(__dirname, '../public');
        this.createDirectories();
    }

    // Create all necessary upload directories
    createDirectories() {
        const dirs = [
            'image',
            'pdf', 
            'video',
            'uploads/member',
            'uploads/activity',
            'uploads/divisi',
            'uploads/periode'
        ];

        dirs.forEach(dir => {
            const fullPath = path.join(this.baseUploadDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
        });
    }

    // Generate unique filename
    generateFilename(file, prefix = '') {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const sanitizedName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .substring(0, 50);
        
        return prefix ? 
            `${prefix}-${uniqueSuffix}-${sanitizedName}` : 
            `${file.fieldname}-${uniqueSuffix}${ext}`;
    }

    // Get storage configuration
    getStorage(options = {}) {
        const {
            destination = 'uploads',
            filenamePrefix = ''
        } = options;

        return multer.diskStorage({
            destination: (req, file, cb) => {
                let uploadPath;
                
                // Determine upload path based on file type and destination
                if (file.mimetype === 'application/pdf') {
                    uploadPath = path.join(this.baseUploadDir, 'pdf');
                } else if (file.mimetype.startsWith('video/')) {
                    uploadPath = path.join(this.baseUploadDir, 'video');
                } else if (file.mimetype.startsWith('image/')) {
                    uploadPath = path.join(this.baseUploadDir, destination === 'uploads' ? 'image' : destination);
                } else {
                    uploadPath = path.join(this.baseUploadDir, destination);
                }
                
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const filename = this.generateFilename(file, filenamePrefix);
                cb(null, filename);
            }
        });
    }

    // File filter for different types
    getFileFilter(allowedTypes = ['image']) {
        return (req, file, cb) => {
            const isValid = allowedTypes.some(type => {
                switch (type) {
                    case 'image':
                        return file.mimetype.startsWith('image/');
                    case 'pdf':
                        return file.mimetype === 'application/pdf';
                    case 'video':
                        return file.mimetype.startsWith('video/');
                    case 'document':
                        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                            .includes(file.mimetype);
                    default:
                        return false;
                }
            });

            if (isValid) {
                cb(null, true);
            } else {
                cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed.`));
            }
        };
    }

    // Create multer upload middleware
    createUpload(options = {}) {
        const {
            destination = 'uploads',
            filenamePrefix = '',
            allowedTypes = ['image'],
            limits = {
                fileSize: 5 * 1024 * 1024, // 5MB default
                files: 5
            }
        } = options;

        return multer({
            storage: this.getStorage({ destination, filenamePrefix }),
            fileFilter: this.getFileFilter(allowedTypes),
            limits
        });
    }

    // Predefined configurations for different modules
    getActivityUpload() {
        return this.createUpload({
            destination: 'image',
            filenamePrefix: 'activity',
            allowedTypes: ['image', 'pdf'],
            limits: { fileSize: 10 * 1024 * 1024 } // 10MB for activities
        });
    }

    getMemberUpload() {
        return this.createUpload({
            destination: 'uploads/member',
            filenamePrefix: 'member',
            allowedTypes: ['image'],
            limits: { fileSize: 2 * 1024 * 1024 } // 2MB for member photos
        });
    }

    getDivisiUpload() {
        return this.createUpload({
            destination: 'uploads/divisi',
            filenamePrefix: 'divisi',
            allowedTypes: ['image'],
            limits: { fileSize: 2 * 1024 * 1024 }
        });
    }

    getPeriodeUpload() {
        return this.createUpload({
            destination: 'uploads/periode',
            filenamePrefix: 'periode',
            allowedTypes: ['image'],
            limits: { fileSize: 2 * 1024 * 1024 }
        });
    }

    getBlogUpload() {
        return this.createUpload({
            destination: 'pdf',
            filenamePrefix: 'article',
            allowedTypes: ['pdf', 'image'],
            limits: { fileSize: 15 * 1024 * 1024 } // 15MB for articles
        });
    }
}

// Create singleton instance
const uploadConfig = new UploadConfig();

module.exports = {
    // Export predefined configurations
    activityUpload: uploadConfig.getActivityUpload(),
    memberUpload: uploadConfig.getMemberUpload(),
    divisiUpload: uploadConfig.getDivisiUpload(),
    periodeUpload: uploadConfig.getPeriodeUpload(),
    blogUpload: uploadConfig.getBlogUpload(),
    
    // Export class for custom configurations
    UploadConfig,
    
    // Export singleton instance
    uploadConfig
};