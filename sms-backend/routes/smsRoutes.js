const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const adminCtrl = require('../controllers/adminController');

// ✅ Envoi de SMS
router.post('/send', smsController.sendSMS);

// ✅ Webhook DR (accusé de réception)
router.post('/delivery-receipt', smsController.receiveDeliveryReceipt);

// ✅ Liste des messages envoyés
router.get('/list', smsController.getAllMessages);

// ✅ Webhook pour les SMS entrants (MO)
router.post('/incoming', smsController.receiveIncomingSMS);

// ✅ Endpoints d'administration
router.get('/admin/contracts', adminCtrl.getSMSBalance);
router.get('/admin/statistics', adminCtrl.getSMSUsage);
router.get('/admin/purchases', adminCtrl.getSMSPurchases);

module.exports = router;
