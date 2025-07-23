<template>
  <div class="sms-form">
    <h2>📩 Envoyer un SMS</h2>

    <form @submit.prevent="sendSMS">
      <div>
        <label for="phone">Numéro (ex: 22177...)</label>
        <input
          id="phone"
          type="text"
          v-model="phone"
          required
          class="form-control"
          placeholder="221771234567"
        />
      </div>

      <div class="mt-3">
        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="message"
          required
          class="form-control"
          placeholder="Entrez votre message ici"
          rows="4"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary mt-4" :disabled="loading">
        {{ loading ? '⏳ Envoi...' : 'Envoyer' }}
      </button>
    </form>

    <div v-if="response" :class="['alert', response.startsWith('✅') ? 'alert-success' : 'alert-danger', 'mt-4']">
      {{ response }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phone: '',
      message: '',
      response: '',
      loading: false
    };
  },
  methods: {
    async sendSMS() {
      this.response = '';
      this.loading = true;

      try {
        const res = await axios.post('/api/sms/send', {
          phone: this.phone,
          message: this.message
        });

        this.response = res.data.message || '✅ SMS envoyé avec succès !';
        this.phone = '';
        this.message = '';
      } catch (err) {
        console.error('Erreur envoi SMS:', err);
        this.response = '❌ Erreur : ' + (err.response?.data?.error || err.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.sms-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* ✅ Couleur orange personnalisée */
h2,
label {
  color: orange;
}

/* ✅ Bouton Bootstrap stylisé */
button.btn {
  background-color: orange;
  border-color: orange;
  color: white;
}

button.btn:hover {
  background-color: #e67e22;
  border-color: #e67e22;
}

.alert {
  font-weight: bold;
  font-size: 1rem;
}
</style>
