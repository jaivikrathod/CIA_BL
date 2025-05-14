const db = require('../../config/db');

exports.vehicalCommon = async (req, res) => {
  try {
    const { user_id, vehicle_number, manufacturer, model, yom, fuel_type, id } = req.body;


    if (!user_id) {
      user_id = req.userID
    }
    // Validate the incoming data
    if (!vehicle_number || !manufacturer || !model || !yom || !fuel_type || !user_id || !id) {
      console.log("All fields are required");
      return res.status(400).json({ message: 'All fields are required' });
    }

    const id2 = parseInt(id, 10); // Convert id to integer

    const query = `
      UPDATE insurance_common_details
      SET user_id=?,vehicle_number = ?, manufacturer = ?, model = ?, yom = ?, fuel_type = ? 
      WHERE id = ?`;

    const values = [user_id, vehicle_number, manufacturer, model, yom, fuel_type, id2];

    // Use db.execute() to run the query
    const [results] = await db.execute(query, values);

    if (results.affectedRows === 0) {
      console.log("No rows were updated. Check if the ID exists.");
      return res.status(404).json({ message: 'No matching record found' });
    }

    return res.status(200).json({ message: true });

  } catch (error) {
    console.error('Error in vehicalCommon:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.getvehicalCommon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Insurance ID is required'
      });
    }
    console.log(id);
    const query = `
            SELECT *
            FROM insurance_common_details 
            WHERE id = ?
        `;

    const [insurance] = await db.execute(query, [id]);


    if (insurance.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Insurance details not found'
      });
    }


    return res.status(200).json({
      success: true,
      data: insurance[0]
    });

  } catch (error) {
    console.error('Error in getvehicalCommon:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching insurance details'
    });
  }
};