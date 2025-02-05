const express = require('express');
const router = express.Router();
const { CRMController } = require('../controllers/crm/CRMController.js');

var crmController = new CRMController();

router.get('/getdata', crmController.GetData);
router.get('/deletedata', crmController.DeleteData);

router.post('/getclientandlogin', crmController.GetClientAndLogin);
router.post('/getclientcrm', crmController.GetClientCRM);
router.post('/insertdata', crmController.InsertData);
router.post('/insertclient', crmController.InsertClient);
router.post('/insertclientcrm', crmController.InsertClientCRM);

module.exports = router;