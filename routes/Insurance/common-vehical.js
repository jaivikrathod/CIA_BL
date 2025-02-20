const db = require('../../config/db');

exports.vehicalCommon = async (req, res) => {
  try {
    console.log("Inside vehicalCommon", req.body);

    const { Register_No, Manufacturer, Model, YOM, fuel_type, id } = req.body;

    // Validate the incoming data
    if (!Register_No || !Manufacturer || !Model || !YOM || !fuel_type) {
      console.log("All fields are required");
      return res.status(400).json({ message: 'All fields are required' });
    }

    const id2 = parseInt(id, 10); // Convert id to integer

    const query = `
      UPDATE insurance_details
      SET vehicle_number = ?, manufacturer = ?, model = ?, year_of_manufacture = ?, fuel_type = ? 
      WHERE id = ?`;

    const values = [Register_No, Manufacturer, Model, YOM, fuel_type, id2];

    // Use db.execute() to run the query
    const [results] = await db.execute(query, values);

    if (results.affectedRows === 0) {
      console.log("No rows were updated. Check if the ID exists.");
      return res.status(404).json({ message: 'No matching record found' });
    }

    console.log("Data updated successfully", results);
    return res.status(200).json({ message: true });

  } catch (error) {
    console.error('Error in vehicalCommon:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};
