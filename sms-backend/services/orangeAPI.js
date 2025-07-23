const axios = require('axios');
require('dotenv').config();

class OrangeAPI {
  static async getAuthToken() {
    try {
      const response = await axios.post(
        process.env.ORANGE_TOKEN_URL,
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
          auth: {
            username: process.env.ORANGE_CLIENT_ID,
            password: process.env.ORANGE_CLIENT_SECRET
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('❌ Erreur Auth Orange:', error.response?.data || error.message);
      throw new Error('Échec d’authentification auprès de l’API Orange');
    }
  }

  static async sendSMS(phoneNumber, message) {
    const token = await this.getAuthToken();

    const senderAddress = process.env.ORANGE_SENDER_ADDRESS; // ex: tel:+2210000
    const senderName = process.env.ORANGE_SENDER_NAME;       // ex: BaService12
    const notifyURL = `${process.env.NOTIFY_URL}/api/sms/delivery-receipt`; // ✅ Ajout ici
    const encodedSender = encodeURIComponent(senderAddress);

    const url = `${process.env.ORANGE_BASE_URL}/outbound/${encodedSender}/requests`;

    const payload = {
      outboundSMSMessageRequest: {
        address: `tel:+${phoneNumber}`,
        senderAddress: senderAddress,
        senderName: senderName,
        outboundSMSTextMessage: {
          message: message
        },
        notifyURL: notifyURL, // ✅ Ajout ici
        callbackData: Date.now().toString() // ✅ Optionnel : un identifiant unique
      }
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur envoi SMS Orange:', error.response?.data || error.message);
      throw new Error('Échec de l’envoi du SMS via Orange');
    }
  }
}

module.exports = OrangeAPI;
