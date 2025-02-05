const express = require('express');
const router = express.Router();
const { SalesforceController } = require('../../controllers/crm/SalesforceController');

var salesforceController = new SalesforceController();

router.post('/login', salesforceController.loginSalesforce);
router.post('/getMe', salesforceController.getUserMe);
router.post('/createAccount', salesforceController.createAccount);
router.post('/createContact', salesforceController.createContact);
router.post('/editAccount', salesforceController.editAccount);
router.post('/editContact', salesforceController.editContact);
router.post('/deleteAccount', salesforceController.deleteAccount);
router.post('/deleteContact', salesforceController.deleteContact);
router.post('/sendEmails', salesforceController.sendEmails);
router.post('/speechIa', salesforceController.convertSpeechToIA);
// router.post('/speechIa2', salesforceController.convertSpeechToIA2);

router.get('/getAccounts', salesforceController.getAccounts);
router.get('/getContacts', salesforceController.getContacts);

module.exports = router;