const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');
const { Op, fn, col, where } = require("sequelize");


// Vehicle Model routes
exports.createVehicleModel = async (req, res) => {
  try {
    const { company_id, type, model_name, model_launch_year, other_detail } = req.body;
    if (!company_id || !type || !model_name || !model_launch_year) {
      return ResponseHandler.validationError(res, 'All required fields must be provided.');
    }
    
    // Check if company exists
    const company = await db.vehicle_company.findByPk(company_id);
    if (!company) {
      return ResponseHandler.notFound(res, 'Vehicle company not found.');
    }
    
    const vehicleModel = await db.vehicle_model.create({ 
      company_id, 
      type, 
      model_name, 
      model_launch_year, 
      other_detail 
    });
    
    return ResponseHandler.created(res, 'Vehicle model created successfully.', vehicleModel);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to create vehicle model: ' + error.message);
  }
};

exports.getVehicleModels = async (req, res) => {
  try {
    const vehicleModels = await db.vehicle_model.findAll({ 
      include: [{
        model: db.vehicle_company,
        as: 'company',
        attributes: ['id', 'company_name']
      }],
      order: [['id', 'DESC']] 
    });
    return ResponseHandler.success(res, 200, 'Vehicle models retrieved successfully.', vehicleModels);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve vehicle models: ' + error.message);
  }
};

exports.getVehicleModelsById = async (req, res) => {
  try {
    const { id } = req.query;

    if(!id){
      return ResponseHandler.error(res, 403, 'Id required');
    }
    const vehicleModels = await db.vehicle_model.findAll({
      where: { company_id: id },
      attributes: ['model_name'],
      raw: true 
    });

    const modelNames = vehicleModels.map(item => item.model_name);


    if (!modelNames) {
      return ResponseHandler.notFound(res, 'Vehicle model not found.');
    }
    return ResponseHandler.success(res, 200, 'Vehicle model retrieved successfully.', modelNames);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve vehicle model: ' + error.message);
  }
};

exports.getVehicleModelsByCompanyName = async (req, res) => {
  try {
    const { company_name } = req.params;
    const vehicleModels = await db.vehicle_model.findAll({
      include: [{
        model: db.vehicle_company,
        as: 'company',
        attributes: ['id', 'company_name'],
        where: {
          company_name: company_name
        }
      }]
    });   
    if (!vehicleModels || vehicleModels.length === 0) {
      return ResponseHandler.notFound(res, 'No vehicle models found for this company.');
    }
    return ResponseHandler.success(res, 200, 'Vehicle models retrieved successfully.', vehicleModels);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve vehicle models: ' + error.message);
  }
};

exports.updateVehicleModel = async (req, res) => {
  try {
    const { id, company_id, type, model_name, model_launch_year, other_detail } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Vehicle model ID is required for update.');
    }
    
    // Check if company exists if company_id is provided
    if (company_id) {
      const company = await db.vehicle_company.findByPk(company_id);
      if (!company) {
        return ResponseHandler.notFound(res, 'Vehicle company not found.');
      }
    }
    
    const [affectedRows] = await db.vehicle_model.update(
      { company_id, type, model_name, model_launch_year, other_detail },
      { where: { id } }
    );
    if (affectedRows === 0) {
      return ResponseHandler.notFound(res, 'Vehicle model not found.');
    }
    const updatedVehicleModel = await db.vehicle_model.findByPk(id, {
      include: [{
        model: db.vehicle_company,
        as: 'company',
        attributes: ['id', 'company_name']
      }]
    });
    return ResponseHandler.updated(res, 'Vehicle model updated successfully.', updatedVehicleModel);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to update vehicle model: ' + error.message);
  }
};

exports.deleteVehicleModel = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Vehicle model ID is required for deletion.');
    }
    const deleted = await db.vehicle_model.destroy({ where: { id } });
    if (!deleted) {
      return ResponseHandler.notFound(res, 'Vehicle model not found.');
    }
    return ResponseHandler.deleted(res, 'Vehicle model deleted successfully.');
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to delete vehicle model: ' + error.message);
  }
}; 

// Vehicle Company routes
exports.createVehicleCompany = async (req, res) => {
  try {
    const { company_name, extras } = req.body;
    if (!company_name) {
      return ResponseHandler.validationError(res, 'Company name is required.');
    }
    const exist = await db.vehicle_company.findOne({
      where: where(fn('LOWER', col('company_name')), company_name.toLowerCase())
    });
        if(exist){
      return ResponseHandler.error(res, 500, 'Company Name is aldready been there ');
    }
    const vehicleCompany = await db.vehicle_company.create({ company_name, extras });
    return ResponseHandler.created(res, 'Vehicle company created successfully.', vehicleCompany);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to create vehicle company: ' + error.message);
  }
};

exports.getVehicleCompanies = async (req, res) => {
  try {
    const vehicleCompanies = await db.vehicle_company.findAll({ 
      order: [['id', 'DESC']] 
    });
    return ResponseHandler.success(res, 200, 'Vehicle companies retrieved successfully.', vehicleCompanies);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve vehicle companies: ' + error.message);
  }
};

exports.getVehicleCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleCompany = await db.vehicle_company.findByPk(id, {
      include: [{
        model: db.vehicle_model,
        as: 'vehicleModels',
        attributes: ['id', 'type', 'model_name', 'model_launch_year']
      }]
    });   
    if (!vehicleCompany) {
      return ResponseHandler.notFound(res, 'Vehicle company not found.');
    }
    return ResponseHandler.success(res, 200, 'Vehicle company retrieved successfully.', vehicleCompany);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve vehicle company: ' + error.message);
  }
};

exports.updateVehicleCompany = async (req, res) => {
  try {
    const { id, company_name, extras } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Vehicle company ID is required for update.');
    }    
    const exist = await db.vehicle_company.findOne({
      where: {
        [Op.and]: [
          where(fn('LOWER', col('company_name')), company_name.toLowerCase()),
          { id: { [Op.ne]: id } } 
        ]
      }
    });
        if(exist){
      return ResponseHandler.error(res, 500, 'Company Name is aldready been there ');
    }

    const [affectedRows] = await db.vehicle_company.update(
      { company_name, extras },
      { where: { id } }
    );
    if (affectedRows === 0) {
      return ResponseHandler.notFound(res, 'Vehicle company not found.');
    }
  
    return ResponseHandler.updated(res, 'Vehicle company updated successfully.');
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to update vehicle company: ' + error.message);
  }
};

exports.deleteVehicleCompany = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'Vehicle company ID is required for deletion.');
    }
    
    const deleted = await db.vehicle_company.update({ where: { id } });
    if (!deleted) {
      return ResponseHandler.notFound(res, 'Vehicle company not found.');
    }
    return ResponseHandler.deleted(res, 'Vehicle company deleted successfully.');
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to delete vehicle company: ' + error.message);
  }
}; 
