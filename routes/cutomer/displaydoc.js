const fs = require('fs');
const path = require('path');

exports.showCustomerdocument = async (req, res) => {
    try {
        const { filename } = req.params; // Extract filename from URL
        const filePath = path.join(__dirname, '../../customer-uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Send file to the client
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error in showdocument function:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

exports.showInsurancedocument = async (req, res) => {
    try {
        const { filename } = req.params; // Extract filename from URL
        const filePath = path.join(__dirname, '../../insurance-uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Send file to the client
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error in showdocument function:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
