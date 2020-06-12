import Vue from 'vue'
import VueRouter from 'vue-router'
import StreamingDashboard from '../sections/streaming/StreamingDashboard.vue'
import SshSftpDashboard from '../sections/sshsftp/SshSftpDashboard.vue'
import Dashboard from '../sections/dashboard/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/streaming',
    name: 'StreamingDashboard',
    component: StreamingDashboard
  },
  {
    path: '/ssh',
    name: 'SshSftpDashboard',
    component: SshSftpDashboard
  },
]

const router = new VueRouter({
  routes
})

export default router
