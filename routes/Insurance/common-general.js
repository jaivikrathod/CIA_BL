const db = require('../../config/db');
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

    let insurance_count=1;
    if(common_id){
         const [count] = await db.execute('select COUNT(*) as count from insurance_details where common_id = ?', [common_id]);
         insurance_count = count[0].count + 1;

    }else{
      common_id = uuidv4();
    }
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
        insurance_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      TDS,
      insurance_count
    ];
    // Use db.execute() to execute the query
    const [results] = await db.execute(sql, values);

    if (results.affectedRows > 0) {
      // Successfully inserted
      console.log("Insurance details inserted successfully:", results.insertId);
      return res.json({ success: true, id: results.insertId,message:'Insurance details inserted successfully'});
    }
    else {
      // Insertion failed
      console.log("Failed to insert insurance details.");
      return res.json({ success: false,message:'Failed to insert insurance details.'});
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: false });
  }
};
