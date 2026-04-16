import { createRouter, createWebHistory } from 'vue-router'
import { getActivePinia } from 'pinia'

const routes = [
  { path: '/', component: () => import('@/pages/LandingPage.vue'), meta: { title: 'RoboContest' } },
  { path: '/login', component: () => import('@/pages/LoginPage.vue'), meta: { title: 'Login', guest: true } },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue'), meta: { title: 'Register', guest: true } },
  { path: '/verify-email', component: () => import('@/pages/VerifyEmailPage.vue'), meta: { title: 'Verify Email' } },
  { path: '/reset-password', component: () => import('@/pages/ResetPasswordPage.vue'), meta: { title: 'Reset Password', guest: true } },
  { path: '/forgot-password', component: () => import('@/pages/ForgotPasswordPage.vue'), meta: { title: 'Forgot Password', guest: true } },
  { path: '/dashboard', component: () => import('@/pages/DashboardPage.vue'), meta: { title: 'Dashboard', auth: true } },
  { path: '/profile', component: () => import('@/pages/ProfilePage.vue'), meta: { title: 'Profile', auth: true } },
  { path: '/contests', component: () => import('@/pages/ContestListPage.vue'), meta: { title: 'Contests' } },
  { path: '/contests/:id', component: () => import('@/pages/ContestPage.vue'), meta: { title: 'Contest' } },
  { path: '/contests/:id/join', component: () => import('@/pages/JoinContestPage.vue'), meta: { title: 'Join Contest', auth: true, requiresRegistration: true } },
  { path: '/leaderboard', component: () => import('@/pages/LeaderboardPage.vue'), meta: { title: 'Leaderboard' } },
  { path: '/rules', component: () => import('@/pages/RulesPage.vue'), meta: { title: 'Rules' } },
  { path: '/about', component: () => import('@/pages/AboutPage.vue'), meta: { title: 'About' } },

  // Admin routes
  {
    path: '/admin',
    meta: { auth: true, admin: true },
    children: [
      { path: '', component: () => import('@/pages/admin/AdminDashboard.vue'), meta: { title: 'Admin Dashboard' } },
      { path: 'contests', component: () => import('@/pages/admin/AdminContests.vue'), meta: { title: 'Manage Contests' } },
      { path: 'contests/:id/questions', component: () => import('@/pages/admin/AdminQuestions.vue'), meta: { title: 'Manage Questions' } },
      { path: 'users', component: () => import('@/pages/admin/AdminUsers.vue'), meta: { title: 'Manage Users' } }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} | RoboContest`
    : 'RoboContest'

  const pinia = getActivePinia()
  if (!pinia) return next()

  const { useAuthStore } = await import('@/stores/auth')
  const { useContestStore } = await import('@/stores/contest')

  const auth = useAuthStore(pinia)
  const contestStore = useContestStore(pinia)

  // AUTH GUARD
  if (to.meta.auth && !auth.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.admin && !auth.isAdmin) {
    return next('/')
  }

  if (to.meta.guest && auth.isLoggedIn) {
    return next('/dashboard')
  }

  if (to.meta.requiresRegistration) {
    try {
      const isRegistered = await contestStore.isRegistered(to.params.id)
      const hasSubmitted = await contestStore.hasSubmittedContest(to.params.id)

      if (!isRegistered || !hasSubmitted) {
        return next(`/contests/${to.params.id}`)
      }

    } catch (e) {
      return next(`/contests/${to.params.id}`)
    }
  }

  next()
})
export default router