
const express = require('express');
const router = express.Router();
const loginController = require('./login');
const signupController = require('./signup');
const tokenController = require('./verifyToken');
const customerAddEditController = require('./cutomer/AddEditCustomer')
const customerDeleteController = require('./cutomer/DeleteCustomer')
const customerListController = require('./cutomer/ListCustomer')

const userListController = require('./User/ListUser');
const userAddEditController = require('./User/AddEditUser')
const userDeleteController = require('./User/DeleteUser')
const getUsersCounts = require('./User/getUsersCounts')
const getCustomerCounts = require('./cutomer/getCustomerCounts')
const getInsuranceCounts = require('./Insurance/getInsuranceCounts')


const FillInitialDetail = require('./Insurance/fill-initial-detail');
const CommonVehical = require('./Insurance/common-vehical');
const CommonGeneral = require('./Insurance/common-general');
const ListInsuranceDetail = require('./Insurance/list-insurance');
const uploadDocument = require('./upload_documents/uploadDocument');
const uploadInsuranceDocument = require('./upload_documents/uploadInsuranceDoc');

const CheckCustomer = require('./cutomer/CheckCustomer');   

const CreateInsurance = require('./Insurance/CreateInsurance');

const changePass = require('./changePass');

router.post('/login', loginController.handleLogin);
router.post('/signup', signupController.handleSignup);
router.post('/change-password/:id', changePass.changePass);
router.post('/verify-token', tokenController.handleTokenVerification);
router.post('/customer-create-edit', customerAddEditController.handleAddEditCustomer);
router.post('/user-create-edit', userAddEditController.handleAddEditUser);

router.post('/customer-delete', customerDeleteController.handleDeleteCustomer);
router.post('/user-delete', userDeleteController.handleDeleteUser);

router.post('/customer-list', customerListController.listCustomers);
router.post('/user-list', userListController.listUsers);

router.post('/fill-initial-details',FillInitialDetail.InitialDetails);

router.post('/common-vehical',CommonVehical.vehicalCommon);
router.post('/common-general',CommonGeneral.generalCommon);

router.post('/insurance-list',ListInsuranceDetail.listInsurance);

router.post('/upload-customer',uploadDocument.uploadKycDocument);
router.post('/upload-insurance',uploadInsuranceDocument.uploadInsuranceDocument);

router.get('/getUsersCounts',getUsersCounts.getUsersCounts);
router.get('/getCustomerCounts',getCustomerCounts.getCustomerCounts);
router.get('/getNewCustomerCounts',getCustomerCounts.getNewCustomerCounts);
router.get('/getInsuranceCounts',getInsuranceCounts.getInsuranceCounts);

router.post('/check-customer', CheckCustomer.CheckCustomer);


router.post('/create-insurance', CreateInsurance.CreateInsurance);
router.post('/renew-insurance', CreateInsurance.RenewInsurance);


module.exports = router;
