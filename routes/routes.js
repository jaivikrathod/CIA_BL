const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();

const loginController = require('./login');
const signupController = require('./signup');
const tokenController = require('./verifyToken');
const changePass = require('./changePass');
const forgetPass = require('./forgetPass')
const verifyOTP = require('./verifyOTP');
const validateUser = require('../authmiddleware');
const { requireAdmin } = require('../adminmiddleware');
protectedRouter.use(validateUser.validateUser);

// ==================== Auth Routes ====================
router.post('/login', loginController.handleLogin);
router.post('/forgot-password',forgetPass.forgetPass );
router.post('/verify-otp', verifyOTP.verifyOTP);
router.post('/signup', signupController.handleSignup);
router.post('/change-password/:id', changePass.changePass);
router.post('/verify-token', protectedRouter, tokenController.handleTokenVerification);

// ==================== User Management ====================
const userListController = require('./User/ListUser');
const userAddEditController = require('./User/AddEditUser');
const userDeleteController = require('./User/DeleteUser');
const getUsersCounts = require('./User/getUsersCounts');

router.post('/user-create-edit',protectedRouter,requireAdmin, userAddEditController.handleAddEditUser);
router.post('/user-delete', protectedRouter, requireAdmin, userDeleteController.handleDeleteUser);
router.post('/user-list', protectedRouter, userListController.listUsers);
router.get('/getUsersCounts', protectedRouter, getUsersCounts.getUsersCounts);
router.get('/particular-user-detail', protectedRouter, userListController.getParticularUserDetails);
router.post('/update-particular-user', protectedRouter, requireAdmin,userListController.updateParticularUserDetails);

// ==================== Customer Management ====================
const customerAddEditController = require('./cutomer/AddEditCustomer');
const customerDeleteController = require('./cutomer/DeleteCustomer');
const customerListController = require('./cutomer/ListCustomer');
const getCustomerCounts = require('./cutomer/getCustomerCounts');
const showCustomerDocument = require('./cutomer/displaydoc');
const CheckCustomer = require('./cutomer/CheckCustomer');
const deleteDocument = require('./cutomer/deleteDocument');

router.post('/customer-create-edit', customerAddEditController.handleAddEditCustomer);
router.post('/customer-delete', protectedRouter, customerDeleteController.handleDeleteCustomer);
router.post('/customer-list', protectedRouter, customerListController.listCustomers);
router.get('/getCustomerCounts', protectedRouter, getCustomerCounts.getCustomerCounts);
router.get('/getNewCustomerCounts', protectedRouter, getCustomerCounts.getNewCustomerCounts);
router.post('/check-customer', protectedRouter, CheckCustomer.CheckCustomer);
router.post('/delete-customer-document', protectedRouter, deleteDocument.deleteDocument);
router.get('/get-customer-uploads/:filename', showCustomerDocument.showCustomerdocument);

// ==================== Insurance Management ====================
const getInsuranceCounts = require('./Insurance/getInsuranceCounts');
const FillInitialDetail = require('./Insurance/fill-initial-detail');
const CommonVehical = require('./Insurance/common-vehical');
const CommonGeneral = require('./Insurance/common-general');
const ListInsuranceDetail = require('./Insurance/list-insurance');
const getParticularInsurance = require('./Insurance/list-insurance');
const Insurance = require('./Insurance/Insurance');
const getStep = require('./Insurance/getInsuranceCounts');
const getInsuranceCommonDetail = require('./Insurance/common-vehical');
const getInitialInsuranceStatus = require('./Insurance/getInitialInsuranceStatus');
const getInsuranceReports = require('./Insurance/insuranceReports');
const deleteInsuranceDocument = require('./Insurance/deleteDocument');

router.get('/getInsuranceCounts', protectedRouter, getInsuranceCounts.getInsuranceCounts);
router.post('/fill-initial-details', protectedRouter, FillInitialDetail.InitialDetails);
router.post('/common-vehical', protectedRouter, CommonVehical.vehicalCommon);
router.post('/common-general', protectedRouter, CommonGeneral.generalCommon);
router.post('/insurance-list', protectedRouter, ListInsuranceDetail.listInsurance);
router.post('/insurance-pending-amount-list', protectedRouter, ListInsuranceDetail.insurancePendingAmountList);
router.post('/create-insurance', protectedRouter, Insurance.CreateInsurance);
router.post('/renew-insurance', protectedRouter, Insurance.RenewInsurance);
router.post('/update-insurance', protectedRouter, Insurance.UpdateInsurance);

router.post('/delete-particular-insurance', protectedRouter, Insurance.DeleteParticularInsurance);
router.post('/delete-insurance-details', protectedRouter, Insurance.DeleteInsuranceDetails);

router.get('/particular-insurance', protectedRouter, getParticularInsurance.getParticularInsurance);
router.get('/particular-insurance-document',protectedRouter,getParticularInsurance.getParticularInsuranceDocuments);
router.get('/get-insurance-docs/:filename', showCustomerDocument.showInsurancedocument);
router.get('/get-common-insurance/:id',protectedRouter,getInsuranceCommonDetail.getvehicalCommon);
router.get('/get-common-insurance2/:id',protectedRouter,getInsuranceCommonDetail.getvehicalCommon2);
router.post('/delete-insurance-document', protectedRouter, deleteInsuranceDocument.deleteDocument);

router.get('/get-step',protectedRouter, getStep.getInsuranceCounterIntialStep);
router.get('/getInitialInsuranceStatus',protectedRouter, getInitialInsuranceStatus.getInitialInsuranceStatus);

router.get('/get-insurance-report',protectedRouter,getInsuranceReports.getInsuranceReports);
router.get('/get-insurance-category-report',protectedRouter,getInsuranceReports.getInsuranceCategoryReports);


// ==================== Insurance Company Management ====================
const insuranceCompanyController = require('./Insurance/insurance-company');

router.post('/insurance-company', protectedRouter, insuranceCompanyController.createInsuranceCompany);
router.get('/insurance-companies', protectedRouter, insuranceCompanyController.listInsuranceCompanies);
router.get('/insurance-company/:id', protectedRouter, insuranceCompanyController.getInsuranceCompanyById);
router.put('/insurance-company', protectedRouter, insuranceCompanyController.updateInsuranceCompany);
router.delete('/insurance-company', protectedRouter, insuranceCompanyController.deleteInsuranceCompany);

// ==================== Document Uploads ====================
const uploadDocument = require('./upload_documents/uploadDocument');
const uploadInsuranceDocument = require('./upload_documents/uploadInsuranceDoc');

router.post('/upload-customer',protectedRouter, uploadDocument.uploadKycDocument);
router.post('/upload-insurance',protectedRouter, uploadInsuranceDocument.uploadInsuranceDocument);

//====================== Agent Management ====================

const agentAddEditController = require('./Agent/AgentManagement');

router.post('/agent-create-edit', protectedRouter, agentAddEditController.handleAddEditAgent);
router.get('/agent-list', protectedRouter, agentAddEditController.listAgents);
router.post('/agent-delete', protectedRouter, agentAddEditController.handleDeleteAgent);
router.get('/getAgentCounts', protectedRouter, agentAddEditController.agentscount);

const VehicleController = require('./Vehicle/VehicleController');

// Vehicle Company routes
router.post('/create-vehicle-company', VehicleController.createVehicleCompany);
router.get('/get-vehicle-companies', VehicleController.getVehicleCompanies);
router.get('/get-vehicle-company/:id', VehicleController.getVehicleCompanyById);
router.post('/update-vehicle-company', VehicleController.updateVehicleCompany);
router.post('/delete-vehicle-company', VehicleController.deleteVehicleCompany);

// Vehicle Model routes
router.post('/create-vehicle-model', VehicleController.createVehicleModel);
router.get('/get-vehicle-models', VehicleController.getVehicleModels);
router.get('/get-vehicle-modelBycompany', VehicleController.getVehicleModelsById);
router.post('/update-vehicle-model', VehicleController.updateVehicleModel);
router.post('/delete-vehicle-model', VehicleController.deleteVehicleModel);

module.exports = router;
