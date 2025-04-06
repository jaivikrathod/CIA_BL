
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
const showCustomerDocument = require('./cutomer/displaydoc'); 
const CheckCustomer = require('./cutomer/CheckCustomer'); 
const CreateInsurance = require('./Insurance/CreateInsurance');

const changePass = require('./changePass');
const deleteDocument = require('./cutomer/deleteDocument');

const getParticularInsurance = require('./Insurance/list-insurance');
const validateUser = require('../authmiddleware');
const protectedRouter = express.Router();
protectedRouter.use(validateUser.validateUser);



router.post('/login', loginController.handleLogin);
router.post('/signup', signupController.handleSignup);
router.post('/change-password/:id', changePass.changePass);
router.post('/verify-token',protectedRouter, tokenController.handleTokenVerification);
router.post('/customer-create-edit', customerAddEditController.handleAddEditCustomer);
router.post('/user-create-edit', userAddEditController.handleAddEditUser);

router.post('/customer-delete',protectedRouter, customerDeleteController.handleDeleteCustomer);
router.post('/user-delete',protectedRouter, userDeleteController.handleDeleteUser);

router.post('/customer-list',protectedRouter, customerListController.listCustomers);
router.post('/user-list',protectedRouter, userListController.listUsers);

router.post('/fill-initial-details',protectedRouter,FillInitialDetail.InitialDetails);

router.post('/common-vehical',protectedRouter,CommonVehical.vehicalCommon);
router.post('/common-general',protectedRouter,CommonGeneral.generalCommon);

router.post('/insurance-list',protectedRouter,ListInsuranceDetail.listInsurance);

router.post('/upload-customer',protectedRouter,uploadDocument.uploadKycDocument);
router.post('/upload-insurance',protectedRouter,uploadInsuranceDocument.uploadInsuranceDocument);

router.get('/getUsersCounts',protectedRouter,getUsersCounts.getUsersCounts);
router.get('/getCustomerCounts',protectedRouter,getCustomerCounts.getCustomerCounts);
router.get('/getNewCustomerCounts',protectedRouter,getCustomerCounts.getNewCustomerCounts);
router.get('/getInsuranceCounts',protectedRouter,getInsuranceCounts.getInsuranceCounts);

router.post('/check-customer',protectedRouter, CheckCustomer.CheckCustomer);

router.get('/get-customer-uploads/:filename', protectedRouter,showCustomerDocument.showCustomerdocument);

router.post('/delete-customer-document',protectedRouter,deleteDocument.deleteDocument);

router.post('/create-insurance',protectedRouter, CreateInsurance.CreateInsurance);
router.post('/renew-insurance',protectedRouter, CreateInsurance.RenewInsurance);

router.get('/particular-insurance',protectedRouter,getParticularInsurance.getParticularInsurance);
router.get('/get-insurance-docs/:filename',protectedRouter,showCustomerDocument.showInsurancedocument);


module.exports = router;
