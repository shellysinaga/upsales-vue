import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '@/views/Auth/SignUpView.vue'
import AddProductView from '@/views/Auth/AddProductView.vue'
import AddProductPhotoView from '@/views/Auth/AddProductPhotoView.vue'
import DashboardView from '@/views/Dashboard/DashboardView.vue'
import ProductIndexView from '@/views/Dashboard/Product/ProductIndexView.vue'
import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout.vue'
import ProductAddView from '@/views/Dashboard/Product/ProductAddView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/add-product',
      name: 'add-product',
      component: AddProductView
    },
    {
      path: '/add-product-photo',
      name: 'add-product-photo',
      component: AddProductPhotoView
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: {
            isDashboard: true,
            activeMenu: 'dashboard',
          },
        },
        {
          path: 'products',
          name: 'dashboard-product-index',
          component: ProductIndexView,
          meta: {
            activeMenu: 'product',
          },
        },
        {
          path: 'products/add',
          name: 'dashboard-product-add',
          component: ProductAddView,
          meta: {
            activeMenu: 'product',
          },
        },
      ],
    },
  ]
})

export default router
