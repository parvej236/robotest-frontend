import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/pages/LandingPage.vue'), meta: { title: 'RoboContest' } },
  { path: '/login', component: () => import('@/pages/LoginPage.vue'), meta: { title: 'Login', guest: true } },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue'), meta: { title: 'Register', guest: true } },
  { path: '/verify-email', component: () => import('@/pages/VerifyEmailPage.vue'), meta: { title: 'Verify Email' } },
  { path: '/dashboard', component: () => import('@/pages/DashboardPage.vue'), meta: { title: 'Dashboard', auth: true } },
  { path: '/profile', component: () => import('@/pages/ProfilePage.vue'), meta: { title: 'Profile', auth: true } },
  { path: '/contests', component: () => import('@/pages/ContestListPage.vue'), meta: { title: 'Contests' } },
  { path: '/contests/:id', component: () => import('@/pages/ContestPage.vue'), meta: { title: 'Contest' } },
  { path: '/contests/:id/join', component: () => import('@/pages/JoinContestPage.vue'), meta: { title: 'Join Contest', auth: true } },
  { path: '/leaderboard', component: () => import('@/pages/LeaderboardPage.vue'), meta: { title: 'Leaderboard' } },
  // Admin routes
  {
    path: '/admin',
    meta: { auth: true, admin: true },
    children: [
      { path: '', component: () => import('@/pages/admin/AdminDashboard.vue'), meta: { title: 'Admin Dashboard' } },
      { path: 'contests', component: () => import('@/pages/admin/AdminContests.vue'), meta: { title: 'Manage Contests' } },
      { path: 'contests/:id/questions', component: () => import('@/pages/admin/AdminQuestions.vue'), meta: { title: 'Manage Questions' } },
      { path: 'users', component: () => import('@/pages/admin/AdminUsers.vue'), meta: { title: 'Manage Users' } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | RoboContest` : 'RoboContest'
  const auth = useAuthStore()

  if (to.meta.auth && !auth.isLoggedIn) return next('/login')
  if (to.meta.admin && !auth.isAdmin) return next('/')
  if (to.meta.guest && auth.isLoggedIn) return next('/dashboard')
  next()
})

export default router
