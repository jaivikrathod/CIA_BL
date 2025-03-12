const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../../config/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = 'insurance-uploads';
        const folderPath = path.join(__dirname, `../../${folderName}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const newFileName = `${req.body.customer_id}_${Date.now()}_${file.originalname}`;
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
        }
    }
}).single('document');



exports.uploadInsuranceDocument = (req, res) => {
    upload(req, res, async (err) => {
        console.log(req.body);
        
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { document_type, customer_id,isCustomerDoc } = req.body;

        if (!document_type || !customer_id) {
            return res.status(400).json({ message: 'Missing required fields: document_type or customer_id' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            let folderName = 'insurance-uploads';
            let table = 'insurance_details';
            const filePath = path.join(__dirname, `../../${folderName}`, req.file.filename);
            const newFileName = `${customer_id}_${Date.now()}_${req.file.originalname}`;
            const finalPath = path.join(__dirname,`../../${folderName}`, newFileName);
        
            fs.rename(filePath, finalPath, (err) => {
                if (err) {
                    console.error('Rename failed:', err);
                    return res.status(500).json({ message: 'File rename failed' });
                }
            });

            let document = {
                name: newFileName,
                type: document_type,
            };
        
            const existingDocumentQuery = `SELECT documents FROM ${table} WHERE id = ?`;
            const [result] = await db.execute(existingDocumentQuery, [customer_id]);
        
            let documentsArray = [];
        
            if (result[0]?.documents) {
                try {
                    documentsArray = JSON.parse(result[0].documents);  // Ensure it's an array
                    if (!Array.isArray(documentsArray)) {
                        documentsArray = [];  // Reset if not an array
                    }
                } catch (error) {
                    documentsArray = [];  // Reset in case of JSON parsing error
                }
        
                // Check if the same document type already exists
                const existingDoc = documentsArray.find(doc => doc.type === document_type);
                if (existingDoc) {
                    fs.unlinkSync(finalPath);  // Delete the newly uploaded file
                    return res.json({ 
                        success: false,
                        message: 'Document of this type is already uploaded' 
                    });
                }
            }
        
            // Add the new document to the array
            documentsArray.push(document);
        
            // Update database with the modified documents array
            const updateQuery = `
                UPDATE ${table}
                SET documents = ?
                WHERE id = ?
            `;
        
            await db.execute(updateQuery, [JSON.stringify(documentsArray), customer_id]);
        
            return res.json({
                success: true,
                message: 'document uploaded successfully',
                file_name: newFileName,
                document_type
            });
        } catch (error) {
            console.error('Error uploading document:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    );  
};
