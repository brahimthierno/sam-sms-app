import { createRouter, createWebHistory } from 'vue-router'
import SmsForm from '../components/SmsForm.vue'
import SmsTable from '../components/SmsTable.vue'
import AdminView from '../components/AdminView.vue'

const routes = [
  { path: '/', name: 'Formulaire', component: SmsForm },
  { path: '/messages', name: 'Messages', component: SmsTable },
  { path: '/admin', name: 'Administration', component: AdminView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
