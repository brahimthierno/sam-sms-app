const axios = require('axios');
require('dotenv').config();

const getAccessToken = async () => {
  const response = await axios.post(
    process.env.ORANGE_TOKEN_URL,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      auth: {
        username: process.env.ORANGE_CLIENT_ID,
        password: process.env.ORANGE_CLIENT_SECRET
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return response.data.access_token;
};

exports.getSMSBalance = async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.orange.com/sms/admin/v1/contracts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSMSUsage = async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.orange.com/sms/admin/v1/statistics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSMSPurchases = async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.orange.com/sms/admin/v1/purchaseorders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
