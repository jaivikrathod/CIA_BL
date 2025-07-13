const db = require('../../models');
const { v4: uuidv4 } = require('uuid');

exports.generalCommon = async (req, res) => {
  try {
    let {
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
      TDS,
      userID,
      id,
      common_id
    } = req.body;

    let customer_id = null;
    const customer = await db.insurance_common_details.findOne({ where: { id } });
    if (customer) {
      customer_id = customer.customer_id;
    }

    let insurance_count = 1;
    if (common_id) {
      const count = await db.insurance_details.count({ where: { common_id } });
      insurance_count = count + 1;
    } else {
      common_id = uuidv4();
    }

    const insuranceDetails = await db.insurance_details.create({
      idv: IDV,
      user_id: userID,
      common_id: common_id,
      customer_id: customer_id,
      insurance_id: id,
      currentncb: CURRENTNCB,
      insurance_company: INSURANCE,
      policy_no: POLICYNO,
      od_premium: ODPREMIUM,
      tp_premium: TPPREMIUM,
      package_premium: PACKAGEPREMIUM,
      gst: GST,
      premium: PREMIUM,
      collection_date: COLLECTIONDATE,
      case_type: CASESTYPE,
      exe_name: EXENAME,
      payment_mode: PAYMENTMODE,
      policy_start_date: NEWPOLICYSTARTDATE,
      policy_expiry_date: NEWPOLICYEXPIRYDATE,
      agent_code: AGNTCODE,
      payout_percent: PAYOUTPERCCENT,
      amount: AMMOUNT,
      tds: TDS,
      insurance_count: insurance_count
    });

    if (insuranceDetails && insuranceDetails.id) {
      console.log("Insurance details inserted successfully:", insuranceDetails.id);
      return res.json({ success: true, id: insuranceDetails.id, message: 'Insurance details inserted successfully' });
    } else {
      console.log("Failed to insert insurance details.");
      return res.json({ success: false, message: 'Failed to insert insurance details.' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: false });
  }
};
