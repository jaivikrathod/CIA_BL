const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');


exports.generalCommon = async (req, res) => {
  try {

    const common_id = uuidv4();

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
      userID,
      id
    } = req.body;

    const sql = `
      INSERT INTO insurance_details
      (
        idv,
        user_id,
        common_id,  
        insurance_id,
        currentncb,
        insurance_company,
        policy_no,
        od_premium,
        tp_premium,
        package_premium,
        gst,
        premium,
        collection_date,
        case_type,
        exe_name,
        payment_mode,
        policy_start_date,
        policy_expiry_date,
        agent_code,
        payout_percent,
        amount,
        tds,
        is_latest
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const values = [
      IDV,
      userID,
      common_id,
      id,
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
    ];

    // Use db.execute() to execute the query
    const [results] = await db.execute(sql, values);

    console.log("Data inserted successfully", results);
    return res.json({ message: true, id: results.insertId });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: false });
  }
};
