const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');


exports.RenewInsurance = async (req, res) => {

    try {
        const [existingData] = await db.query(
            'SELECT * FROM insurance_details WHERE is_latest = 1 AND insurance_id = ?',
            [req.body.id]
        );

        if (existingData.length === 0) {
            return res.json({ success: false, message: 'Insurance ID not found.' });
        }

        let dataToInsert = { ...existingData[0] };
        delete dataToInsert.id;
        delete dataToInsert.insurance_date;


        const {
            IDV,
            CURRENTNCB,
            INSURANCE,
            POLICYNO,
            ODPREMIUM,
            TPPREMIUM,
            PACKAGEPREMIUM,
            GST,
            PREMIUM,
            COLLECTIONDATE,
            CASESTYPE,
            EXENAME,
            PAYMENTMODE,
            NEWPOLICYSTARTDATE,
            NEWPOLICYEXPIRYDATE,
            AGNTCODE,
            PAYOUTPERCCENT,
            AMMOUNT,
            TDS
        } = req.body;

        // 4. Update dataToInsert with new values
        dataToInsert.idv = IDV;
        dataToInsert.currentncb = CURRENTNCB;
        dataToInsert.insurance_company = INSURANCE;
        dataToInsert.policy_no = POLICYNO;
        dataToInsert.od_premium = ODPREMIUM;
        dataToInsert.tp_premium = TPPREMIUM;
        dataToInsert.package_premium = PACKAGEPREMIUM;
        dataToInsert.gst = GST;
        dataToInsert.premium = PREMIUM;
        dataToInsert.collection_date = COLLECTIONDATE;
        dataToInsert.case_type = CASESTYPE;
        dataToInsert.exe_name = EXENAME;
        dataToInsert.payment_mode = PAYMENTMODE;
        dataToInsert.policy_start_date = NEWPOLICYSTARTDATE;
        dataToInsert.policy_expiry_date = NEWPOLICYEXPIRYDATE;
        dataToInsert.agent_code = AGNTCODE;
        dataToInsert.payout_percent = PAYOUTPERCCENT;
        dataToInsert.amount = AMMOUNT;
        dataToInsert.tds = TDS;
        dataToInsert.is_latest = 1; // Ensure new entry is marked as latest

        // 5. Insert new record with updated values
        const [response] = await db.query(
            'INSERT INTO insurance_details SET ?',
            [dataToInsert]
        );

        if (response?.insertId) {
            const check = await db.query(
                'UPDATE insurance_details SET is_latest = 0 WHERE id = ?',
                [req.body.id]);
            if (check && check.affectedRows > 0) {
                return res.json({ success: true, id: InsertedID, message: 'Insurance Renewed successfully.' });
            } else {
                return res.json({ success: false, message: 'Failed to Renew insurance.' });
            }
        } else {
            return res.json({ success: false, message: 'Failed to Renew insurance.' });
        }
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}


exports.CreateInsurance = async (req, res) => {
    try {
        const common_id = uuidv4();
        const [response] = await db.query('INSERT INTO insurance_details (customer_id, common_id) VALUES(?, ?)', [req.body.customerID, common_id]);
        const InsertedID = response.insertId;
        if (InsertedID) {
            return res.json({ success: true, id: InsertedID, message: 'Insurance created successfully.' });
        } else {
            return res.json({ success: false, message: 'Failed to create insurance.' });
        }
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

