const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../../config/db');

// Multer configuration for file uploads
const upload = multer({
    dest: 'uploads/', // Directory where files will be temporarily stored
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Allow only specific file types (e.g., PDF, JPEG, PNG)
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
        }
    }
}).single('document'); // Expecting a single file upload with key 'document'

exports.uploadKycDocument = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { document_type, customer_id } = req.body;

        // Validate required fields
        if (!document_type || !customer_id) {
            return res.status(400).json({ message: 'Missing required fields: document_type or customer_id' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename);
            const newFileName = `${customer_id}_${Date.now()}_${req.file.originalname}`;
            const finalPath = path.join(__dirname, '../../uploads', newFileName);

            // Rename the file for better organization
            fs.renameSync(filePath, finalPath);

            // Update database with file name and type
            const query = `
                UPDATE customer
                SET file_name = ?, kyc_file_type = ?
                WHERE id = ?
            `;

            await db.execute(query, [newFileName, document_type, customer_id]);

            return res.status(200).json({
                message: 'KYC document uploaded successfully',
                file_name: newFileName,
                document_type
            });
        } catch (error) {
            console.error('Error uploading KYC document:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};
