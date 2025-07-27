const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');

exports.createCar = async (req, res) => {
  try {
    const { company_name, type, model_name, model_launch_year, other_detail } = req.body;
    if (!company_name || !type || !model_name || !model_launch_year) {
      return ResponseHandler.validationError(res, 'All required fields must be provided.');
    }
    const car = await db.cars.create({ company_name, type, model_name, model_launch_year, other_detail });
    return ResponseHandler.created(res, 'Car created successfully.', car);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to create car.' + error);
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await db.cars.findAll({ order: [['id', 'DESC']] });
    return ResponseHandler.success(res, 200, 'Cars retrieved successfully.', cars);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve cars.', error);
  }
};

exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await db.cars.findByPk(id);
    if (!car) {
      return ResponseHandler.notFound(res, 'Car not found.');
    }
    return ResponseHandler.success(res, 200, 'Car retrieved successfully.', car);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve car.', error);
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id } = req.body;
    const { company_name, type, model_name, model_launch_year, other_detail } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Car ID is required for update.');
    }
    const [affectedRows] = await db.cars.update(
      { company_name, type, model_name, model_launch_year, other_detail },
      { where: { id } }
    );
    if (affectedRows === 0) {
      return ResponseHandler.notFound(res, 'Car not found.');
    }
    const updatedCar = await db.cars.findByPk(id);
    return ResponseHandler.updated(res, 'Car updated successfully.', updatedCar);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to update car.', error);
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Car ID is required for deletion.');
    }
    const deleted = await db.cars.destroy({ where: { id } });
    if (!deleted) {
      return ResponseHandler.notFound(res, 'Car not found.');
    }
    return ResponseHandler.deleted(res, 'Car deleted successfully.');
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to delete car.', error);
  }
}; 