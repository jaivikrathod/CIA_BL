const db = require('../../models');

exports.vehicalCommon = async (req, res) => {
  try {
    let { user_id, vehicle_number, manufacturer, model, yom, fuel_type, id } = req.body;

    if (!user_id) {
      user_id = req.userID;
    }
    // Validate the incoming data
    if (!vehicle_number || !manufacturer || !model || !yom || !fuel_type || !user_id || !id) {
      console.log("All fields are required");
      return res.status(400).json({ message: 'All fields are required' });
    }

    const id2 = parseInt(id, 10); // Convert id to integer

    const [affectedRows] = await db.insurance_common_details.update(
      {
        user_id,
        vehicle_number,
        manufacturer,
        model,
        yom,
        fuel_type
      },
      { where: { id: id2 } }
    );

    if (affectedRows === 0) {
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

    const insurance = await db.insurance_common_details.findOne({ where: { id } });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance details not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: insurance
    });

  } catch (error) {
    console.error('Error in getvehicalCommon:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching insurance details'
    });
  }
};