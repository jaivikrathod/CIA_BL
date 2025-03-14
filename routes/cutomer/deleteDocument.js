const fs = require('fs');
const path = require('path');
const db = require('../../config/db');

exports.deleteDocument = async (req, res) => {
    try {
        const { selectedID, document } = req.body;
        if (!selectedID) {
            return res.status(400).json({ success: false, message: 'Customer ID is required for deletion.' });
        }

        // Fetch customer data
        const customerQuery = 'SELECT documents FROM customer WHERE id = ?';
        const [selectedCustomer] = await db.execute(customerQuery, [selectedID]);

        if (selectedCustomer.length <= 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        let folderName = 'customer-uploads';
        const filePath = path.join(__dirname, `../../${folderName}`, document);

        // Remove the document from database
        const documents = JSON.parse(selectedCustomer[0].documents);
        const updatedDocuments = documents.filter(doc => doc.name !== document);
        const updateQuery = 'UPDATE customer SET documents = ? WHERE id = ?';
        await db.execute(updateQuery, [JSON.stringify(updatedDocuments), selectedID]);

        // Check if file exists before attempting to delete it
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete file from storage
        } else {
            console.warn(`File not found: ${filePath}`);
        }

        return res.status(200).json({ success: true, message: 'Document deleted successfully.' });

    } catch (error) {
        console.error('Error in deleteDocument:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
