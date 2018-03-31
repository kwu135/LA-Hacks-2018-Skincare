import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Product from '@/components/Product'
import AddProduct from '@/components/AddProduct'
import Login from '@/components/Login'
import Register from '@/components/Register'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/product/:product',
      name: 'product',
      component: Product
    },
    {
      path: '/add-product',
      name: 'add-product',
      component: AddProduct
    }
  ]
})
