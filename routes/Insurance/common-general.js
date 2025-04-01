const db = require('../../config/db');

exports.generalCommon = async (req, res) => {
  try {
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
      TDS,
      id
    } = req.body;

    const sql = `
      UPDATE insurance_details
      SET 
        idv = ?,
        currentncb = ?,
        insurance_company = ?,
        policy_no = ?,
        od_premium = ?,
        tp_premium = ?,
        package_premium = ?,
        gst = ?,
        premium = ?,
        collection_date = ?,
        case_type = ?,
        exe_name = ?,
        payment_mode = ?,
        policy_start_date = ?,
        policy_expiry_date = ?,
        agent_code = ?,
        payout_percent = ?,
        amount = ?,
        tds = ?,
        is_latest = 1
      WHERE id = ?
    `;

    const values = [
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
      id
    ];

    // Use db.execute() to execute the query
    const [results] = await db.execute(sql, values);

    if (results.affectedRows === 0) {
      console.log("No rows were updated. Check if the ID exists.");
      return res.status(404).json({ message: false });
    }

    console.log("Data updated successfully", results);
    return res.json({ message: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: false });
  }
};
