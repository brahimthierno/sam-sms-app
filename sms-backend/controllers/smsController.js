const OrangeAPI = require('../services/orangeAPI');
const db = require('../config/db');
require('dotenv').config();

// ✅ Envoi SMS
exports.sendSMS = async (req, res) => {
  const { phone, message } = req.body;

  try {
    const insertSQL = 'INSERT INTO messages (phone, message, status) VALUES (?, ?, ?)';
    db.query(insertSQL, [phone, message, 'DeliveredToTerminal'], async (err, result) => {
      if (err) {
        console.error('Erreur MySQL:', err);
        return res.status(500).json({ error: 'Erreur lors de l’enregistrement du SMS' });
      }

      const messageId = result.insertId;
      const notifyURL = `${process.env.NOTIFY_URL}/api/sms/delivery-receipt`;

      try {
        const resultOrange = await OrangeAPI.sendSMS(phone, message, notifyURL, messageId);
        const resourceURL = resultOrange?.resourceURL || null;

        const updateSQL = 'UPDATE messages SET resource_url = ? WHERE id = ?';
        db.query(updateSQL, [resourceURL, messageId], (err) => {
          if (err) console.error('Erreur UPDATE resourceURL:', err);
        });

        res.status(200).json({
          message: '✅ SMS envoyé avec succès',
          id: messageId,
          resourceURL,
          response: resultOrange
        });
      } catch (err) {
        console.error('Erreur envoi SMS Orange:', err.message);
        res.status(500).json({ error: 'Erreur lors de l’envoi via Orange API' });
      }
    });
  } catch (err) {
    console.error('Erreur serveur:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Réception DR (accusé de réception)
exports.receiveDeliveryReceipt = (req, res) => {
  try {
    const data = req.body.deliveryInfoNotification;
    const status = data.deliveryInfo.deliveryStatus;
    const callbackData = data.callbackData;

    const logSQL = 'INSERT INTO dr_logs (message_id, delivery_status) VALUES (?, ?)';
    db.query(logSQL, [callbackData, status], (err) => {
      if (err) console.error('Erreur MySQL DR:', err);
    });

    const updateSQL = 'UPDATE messages SET status = ? WHERE id = ?';
    db.query(updateSQL, [status, callbackData], (err) => {
      if (err) console.error('Erreur UPDATE statut:', err);
    });

    res.status(200).send('DR reçu avec succès ✅');
  } catch (err) {
    console.error('Erreur traitement DR:', err.message);
    res.status(400).send('Erreur traitement DR');
  }
};

// ✅ Liste des messages
exports.getAllMessages = (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
    res.status(200).json(results);
  });
};

// ✅ Nouveau : Réception SMS entrants (MO)
exports.receiveIncomingSMS = (req, res) => {
  try {
    const incoming = req.body.inboundSMSMessageList;
    const message = incoming.inboundSMSMessage[0];

    const phone = message.senderAddress;
    const content = message.message;
    const date = message.dateTime;

    const sql = 'INSERT INTO incoming_messages (phone, message, received_at) VALUES (?, ?, ?)';
    db.query(sql, [phone, content, date], (err) => {
      if (err) {
        console.error('Erreur MySQL MO:', err);
        return res.status(500).send('Erreur base de données');
      }
      res.status(200).send('SMS entrant reçu ✅');
    });
  } catch (err) {
    console.error('Erreur traitement SMS entrant:', err.message);
    res.status(400).send('Erreur parsing');
  }
};
