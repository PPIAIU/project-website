const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/image');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure PDF upload directory exists
const pdfUploadDir = path.join(__dirname, '../public/pdf');
if (!fs.existsSync(pdfUploadDir)) {
    fs.mkdirSync(pdfUploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Choose directory based on file type
        if (file.mimetype === 'application/pdf') {
            cb(null, pdfUploadDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: function (req, file, cb) {
        // Generate unique filename with sanitized name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        
        // Sanitize filename: remove special characters, spaces, etc.
        const sanitizedName = nameWithoutExt
            .replace(/[^a-zA-Z0-9\-_]/g, '_')  // Replace special chars with underscore
            .replace(/_+/g, '_')               // Replace multiple underscores with single
            .replace(/^_|_$/g, '')             // Remove leading/trailing underscores
            .substring(0, 50);                 // Limit length
        
        const prefix = file.mimetype === 'application/pdf' ? 'article' : 'activity';
        cb(null, prefix + '-' + uniqueSuffix + '-' + sanitizedName + ext);
    }
});

// File filter - allow images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedPdfTypes = /pdf/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    
    const isImage = (allowedImageTypes.test(extname.slice(1)) && mimetype.startsWith('image/')) ||
                   (file.fieldname && file.fieldname.includes('image'));
    const isPdf = (allowedPdfTypes.test(extname.slice(1)) && mimetype === 'application/pdf') ||
                 (file.fieldname && file.fieldname.includes('pdfFile'));
    
    if (isImage || isPdf) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) and PDF files are allowed'));
    }
};

// Multer configuration
const uploadActivity = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (for PDFs)
        files: 2 // max 2 files (image + PDF)
    },
    fileFilter: fileFilter
});

module.exports = uploadActivity;
