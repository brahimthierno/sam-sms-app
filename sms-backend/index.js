require('dotenv').config();
const express = require('express');
const cors = require('cors');
const smsRoutes = require('./routes/smsRoutes');
const { IpFilter, IpDeniedError } = require('express-ipfilter'); // 🧱 IP filtering

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Liste des IPs Orange autorisées
const orangeIPs = ['62.161.18.71', '62.161.18.72'];

// 🛡️ Appliquer le filtrage uniquement sur le webhook de DR
app.use('/api/sms/delivery-receipt', IpFilter(orangeIPs, { mode: 'allow' }));

// ✅ Routes principales
app.use('/api/sms', smsRoutes);

// 🔐 Gérer les erreurs IP non autorisées
app.use((err, req, res, next) => {
  if (err instanceof IpDeniedError) {
    console.warn(`⛔ IP refusée : ${req.ip}`);
    res.status(403).json({ error: '⛔ Accès refusé : IP non autorisée' });
  } else {
    next(err);
  }
});

// ✅ Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sama Backend bi mongui daw ci port ${PORT}`);
});
