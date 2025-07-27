const db = require('../../models');
const { v4: uuidv4 } = require('uuid');

exports.generalCommon = async (req, res) => {
  try {
    let {
      idv,
      currentncb,
      insurance_company,
      policy_no,
      od_premium,
      tp_premium,
      package_premium,
      gst,
      premium,
      business_type,
      insurance_date,
      collection_date,
      case_type,
      payment_mode,
      policy_start_date,
      policy_expiry_date,
      agent_id,
      emp_id,
      payout_percent,
      amount,
      tds,
      user_id,
      insurance_id,
      common_id
    } = req.body;

    let customer_id = null;
    const customer = await db.insurance_common_details.findOne({ where: { id:insurance_id } });
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
      idv: idv,// done 
      currentncb: currentncb,
      user_id: user_id,
      common_id: common_id,
      customer_id: customer_id,
      insurance_id: insurance_id,
      insurance_company: insurance_company,
      policy_no: policy_no,
      od_premium: od_premium,
      tp_premium: tp_premium,
      package_premium: package_premium,
      gst: gst,
      premium: premium,
      collection_date: collection_date,
      case_type: case_type,
      payment_mode: payment_mode,
      insurance_date: insurance_date,
      policy_start_date: policy_start_date,
      policy_expiry_date: policy_expiry_date,
      agent_id: agent_id,
      // emp_id: emp_id,
      business_type,business_type,
      payout_percent: payout_percent,
      amount: amount,
      tds: tds,
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
    res.status(500).json({ message: false,error });
  }
};
