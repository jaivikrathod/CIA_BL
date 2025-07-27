const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');

exports.createInsuranceCompany = async (req, res) => {
  try {
    const { name, extras } = req.body;
    if (!name) {
      return ResponseHandler.validationError(res, 'Name is required.');
    }
    const company = await db.insurance_company.create({ name, extras });
    return ResponseHandler.created(res, 'Insurance company created successfully.', company);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to create insurance company.', error);
  }
};

exports.listInsuranceCompanies = async (req, res) => {
  try {
    const companies = await db.insurance_company.findAll({ order: [['id', 'DESC']] });
    return ResponseHandler.success(res, 200, 'Insurance companies retrieved successfully.', companies);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve insurance companies.', error);
  }
};

exports.getInsuranceCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await db.insurance_company.findByPk(id);
    if (!company) {
      return ResponseHandler.notFound(res, 'Insurance company not found.');
    }
    return ResponseHandler.success(res, 200, 'Insurance company retrieved successfully.', company);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to retrieve insurance company.', error);
  }
};

exports.updateInsuranceCompany = async (req, res) => {
  try {
    const { id, name, extras } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'ID is required for update.');
    }
    const [affectedRows] = await db.insurance_company.update(
      { name, extras },
      { where: { id } }
    );
    if (affectedRows === 0) {
      return ResponseHandler.notFound(res, 'Insurance company not found.');
    }
    const updatedCompany = await db.insurance_company.findByPk(id);
    return ResponseHandler.updated(res, 'Insurance company updated successfully.', updatedCompany);
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to update insurance company.', error);
  }
};

exports.deleteInsuranceCompany = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return ResponseHandler.validationError(res, 'ID is required for deletion.');
    }
    const deleted = await db.insurance_company.destroy({ where: { id } });
    if (!deleted) {
      return ResponseHandler.notFound(res, 'Insurance company not found.');
    }
    return ResponseHandler.deleted(res, 'Insurance company deleted successfully.');
  } catch (error) {
    return ResponseHandler.error(res, 500, 'Failed to delete insurance company.', error);
  }
};
