import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/LoginView.vue'
import Register from '../views/auth/RegisterView.vue'
import AdminLayout from '../components/admin/AdminLayout.vue'
import AppLayout from '../components/user/layout/AppLayout.vue'
import UserList from '../views/admin/users/UserList.vue'

// ============== Define Routes ==============
const routes = [
  {
    path: '/',
    name: 'home',
    title: 'home',
    component: AppLayout,
    meta: { requiresAuth: false },
  },
  {
    path: '/admin/auth/login',
    name: 'login',
    title: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/admin/auth/register',
    name: 'register',
    title: 'Register',
    component: Register,
    meta: { guest: true },
  },

  {

    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/errors/Unauthorized.vue'),
    meta: {
      requiresAuth: false

     }
  },

  // ============== Admin Dashboard Routes ==============

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },

      // _________________ Contact Route ____________________________
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import('@/views/admin/contact/ContactList.vue'),
        meta: { title: 'Contacts' },
      },

      // _________________ Users Route ____________________________
      {
        path: 'users',
        name: 'admin.users',
        component: UserList,
        meta: { title: 'Users Management', },
      },

      {
        path: '/admin/profile',
        name: 'admin.profile',
        component: () => import('@/views/admin/Profile.vue'),
        meta: { title: 'My Profile', requiresAuth: true }
      },
      {
        path: '/admin/profile/edit',
        name: 'admin.profile.edit',
        component: () => import('@/views/admin/EditProfile.vue'),
        meta: { title: 'Edit Profile', requiresAuth: true }
      },

      // _________________ Blog Route ____________________________
      {
        path: 'blog/categories',
        name: 'admin.blog.categories',
        component: () => import('@/views/admin/blog/BlogCategories.vue'),
        meta: { title: 'Blog Categories' },
      },

      {
        path: 'blog/tags',
        name: 'admin.blog.tags',
        component: () => import('@/views/admin/blog/BlogTags.vue'),
        meta: { title: 'Blog Tags' },
      },

      {
        path: 'blog',
        name: 'admin.blog',
        component: () => import('@/views/admin/blog/BlogList.vue'),
        meta: { title: 'Blog' },
      },
      {
        path: 'blog/create',
        name: 'admin.blog.create',
        component: () => import('@/views/admin/blog/BlogCreate.vue'),
        meta: { title: 'Create Post' },
      },
      {
        path: 'blog/:id/edit',
        name: 'admin.blog.edit',
        component: () => import('@/views/admin/blog/BlogEdit.vue'),
        meta: { title: 'Edit Post' },
      },
      {
      path: 'blog/:id',
      name: 'admin.blog.show',
      component: () => import('@/views/admin/blog/BlogShow.vue'),
      meta: { title: 'Post Details' },
     },

      // _________________ Portfolio Route ____________________________
     {
   path: 'portfolio',
      children: [
        {
          path: '',
          name: 'admin.portfolio.index',
          component: () => import('@/views/admin/portfolio/PortfolioList.vue'),
          meta: { title: 'Portfolio' },
        },
        {
          path: 'create',
          name: 'admin.portfolio.create',
          component: () => import('@/views/admin/portfolio/PortfolioCreate.vue'),
          meta: { title: 'add work' },
        },
        {
          path: ':id/edit',
          name: 'admin.portfolio.edit',
          component: () => import('@/views/admin/portfolio/PortfolioEdit.vue'),
          meta: { title: 'edit work' },
        },
        {
          path: 'categories',
          name: 'admin.portfolio.categories',
          component: () => import('@/views/admin/portfolio/PortfolioCategories.vue'),
          meta: { title: 'items Portfolio' },
        },
     ],
    },


    // _________________ Service Route ____________________________

{ path: 'services',        component: () => import('../views/admin/services/ServiceList.vue') },
{ path: 'services/create', component: () => import('../views/admin/services/ServiceCreate.vue') },
{ path: 'services/:id',    component: () => import('../views/admin/services/ServiceShow.vue') },
{ path: 'services/:id/edit', component: () => import('../views/admin/services/ServiceEdit.vue') },

{
    path: '/admin/services/service-requests',
    name: 'service-requests',
    component: () =>
        import('@/views/admin/services/ServiceRequestsView.vue')
},

{
  path: 'comments',
     component: () => import('../views/admin/blog/PostsComments.vue')
},
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin/dashboard',
  },

{
  path: '/admin/auth/forgot-password',
  name: 'admin.auth.forgotPassword',
  component: () => import('../views/auth/ForgotPasswordView.vue')
},
{
  path: '/admin/auth/reset-password',
  name: 'admin.auth.resetPassword',
  component: () => import('../views/auth/ResetPasswordView.vue')
},

]


// ==============  Create Router ==============
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// ============== Navigation Guards ==============
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  //  Page Title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Mustafa`
  }

  // If Page need login without token
  if (requiresAuth && !token) {
    next('/admin/auth/login')
    return
  }

  // (login/register) For Visitors
  if (isGuestOnly && token) {
    next('/admin/dashboard')
    return
  }

  // Chake spcific permission
  if (to.meta.permission && token) {
    const permissions = JSON.parse(localStorage.getItem('user_permissions') || '[]')
    const userRole = localStorage.getItem('user_role')

    const hasAccess = userRole === 'admin' || permissions.includes(to.meta.permission)

    if (!hasAccess) {
      next('/unauthorized')
      return
    }
  }

  next()
})

export default router
