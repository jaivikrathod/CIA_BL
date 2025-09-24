const db = require('../../models');
const { v4: uuidv4 } = require('uuid');

exports.RenewInsurance = async (req, res) => {
    try {
        const existingData = await db.insurance_details.findOne({
            where: { is_latest: 1, insurance_id: req.body.id }
        });

        if (!existingData) {
            return res.json({ success: false, message: 'Insurance ID not found.' });
        }

        let dataToInsert = existingData.toJSON();
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
            PAYMENTMODE,
            NEWPOLICYSTARTDATE,
            NEWPOLICYEXPIRYDATE,
            AGNTCODE,
            PAYOUTPERCCENT,
            AMMOUNT,
            TDS
        } = req.body;

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
        dataToInsert.payment_mode = PAYMENTMODE;
        dataToInsert.policy_start_date = NEWPOLICYSTARTDATE;
        dataToInsert.policy_expiry_date = NEWPOLICYEXPIRYDATE;
        dataToInsert.agent_id = AGNTCODE;
        dataToInsert.payout_percent = PAYOUTPERCCENT;
        dataToInsert.amount = AMMOUNT;
        dataToInsert.tds = TDS;
        dataToInsert.is_latest = 1;

        const response = await db.insurance_details.create(dataToInsert);

        if (response && response.id) {
            const check = await db.insurance_details.update(
                { is_latest: 0 },
                { where: { id: req.body.id } }
            );
            if (check && check[0] > 0) {
                return res.json({ success: true, id: response.id, message: 'Insurance Renewed successfully.' });
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
        const response = await db.insurance_details.create({
            customer_id: req.body.customerID,
            common_id: common_id
        });
        if (response && response.id) {
            return res.json({ success: true, id: response.id, message: 'Insurance created successfully.' });
        } else {
            return res.json({ success: false, message: 'Failed to create insurance.' });
        }
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

exports.UpdateInsurance = async (req, res) => {
    try {
        const data = req.body.payload;
        // console.log('Received data:', data);
        // console.log('isMotor:', data.isMotor);
        // console.log('insurance_detail_id:', data.insurance_detail_id);
        // console.log('insurance_common_detail_id:', data.insurance_common_detail_id);
        
        if (data.isMotor) {
            const commonUpdateResult = await db.insurance_common_details.update({
                ...data.motor_details,
                segment: data.segment
            }, {
                where: {
                    id: data.insurance_common_detail_id
                }
            });

        } else {

            const commonUpdateResult = await db.insurance_common_details.update({
                segment: data.segment
            }, {
                where: {
                    id: data.insurance_common_detail_id
                }
            });
        }

        const detailsUpdateResult = await db.insurance_details.update({
            ...data.other_details
        }, {
            where: {
                id: data.insurance_detail_id
            }
        });

        return res.status(200).json({ 
            success:  true, 
            message: 'Insurance details updated successfully' 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'An internal server error occurred: ' + error.message 
        });
    }
}

exports.DeleteParticularInsurance = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Insurance ID is required for deletion.' });
        }

        const record = await db.insurance_details.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({ success: false, message: 'Insurance not found.' });
        }

        const { insurance_id } = record;

        const count = await db.insurance_details.count({ where: { insurance_id } });

        if (count == 1) {
            await db.insurance_common_details.destroy({ where: { id: insurance_id } });
        }

        const deleted = await db.insurance_details.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Insurance not found.' });
        }

        return res.status(200).json({ success: true, message: 'Insurance deleted successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};


exports.DeleteInsuranceDetails = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Record id is required.' });
        }

        const record = await db.insurance_details.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found.' });
        }

        const insuranceId = record.insurance_id;

        const deleted = await db.insurance_details.destroy({
            where: { insurance_id: insuranceId }
        });

        const deleted2 = await db.insurance_common_details.destroy({
            where: { id: insuranceId }
        });

        if (!deleted || !deleted2) {
            return res.status(404).json({ success: false, message: 'Record not found.' });
        }

        return res.status(200).json({ success: true, message: 'Deleted successfully.' });

    } catch (error) {
        console.error('DeleteInsuranceDetails error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
