<template>
  <div class="container mt-5">
    <h3 class="text-warning">📋 Administration du compte Orange</h3>

    <div class="mt-4">
      <h5 class="text-warning">🔢 Solde SMS</h5>
      <pre class="text-white bg-dark bg-opacity-50 p-3 rounded">{{ balance }}</pre>
    </div>

    <div class="mt-4">
      <h5 class="text-warning">📊 Statistiques d’usage</h5>
      <pre class="text-white bg-dark bg-opacity-50 p-3 rounded">{{ stats }}</pre>
    </div>

    <div class="mt-4">
      <h5 class="text-warning">🛒 Historique des achats</h5>
      <pre class="text-white bg-dark bg-opacity-50 p-3 rounded">{{ purchases }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminView',
  data() {
    return {
      balance: null,
      stats: null,
      purchases: null
    };
  },
  async mounted() {
    try {
      const [balance, stats, purchases] = await Promise.all([
        axios.get('/api/sms/admin/contracts'),
        axios.get('/api/sms/admin/statistics'),
        axios.get('/api/sms/admin/purchases')
      ]);

      this.balance = balance.data;
      this.stats = stats.data;
      this.purchases = purchases.data;
    } catch (err) {
      console.error('Erreur récupération admin info:', err.message);
    }
  }
};
</script>
