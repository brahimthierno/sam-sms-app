<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-warning">📋 Messages envoyés</h2>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th scope="col" class="text-warning">Destinataire</th>
          <th scope="col" class="text-warning">Message</th>
          <th scope="col" class="text-warning">Statut</th>
          <th scope="col" class="text-warning">Date Envoi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="msg in messages" :key="msg.id">
          <td>{{ msg.phone }}</td>
          <td>{{ msg.message }}</td>
          <td>
            <span :class="statusBadge(msg.status)">
              {{ msg.status }}
            </span>
          </td>
          <td>{{ formatDate(msg.created_at) }}</td>
         
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SmsTable',
  data() {
    return {
      messages: [],
      intervalId: null
    };
  },
  mounted() {
    this.fetchMessages();
    this.intervalId = setInterval(this.fetchMessages, 10000); // ⏱️ Auto-refresh
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // 🧹 Nettoyage du timer
  },
  methods: {
    async fetchMessages() {
      try {
        const res = await axios.get('/api/sms/list');
        this.messages = res.data;
      } catch (err) {
        console.error('Erreur récupération messages :', err.message);
      }
    },
    statusBadge(status) {
      if (status === 'DeliveredToTerminal') return 'badge bg-success';
      if (status === 'pending') return 'badge bg-warning text-dark';
      if (status === 'DeliveryImpossible') return 'badge bg-danger';
      return 'badge bg-secondary';
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>
