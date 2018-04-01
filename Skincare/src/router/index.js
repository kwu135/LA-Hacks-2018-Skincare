import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie';
import VueResource from 'vue-resource';


import Home from '@/components/Home'
import Product from '@/components/Product'
import AddProduct from '@/components/AddProduct'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Search from '@/components/Search'

import 'vue-awesome/icons'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import Icon from 'vue-awesome/components/Icon'

Vue.use(Router)
Vue.use(BootstrapVue);
Vue.use(VueCookie);
Vue.use(VueResource);
// globally
Vue.component('icon', Icon)

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
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
