<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#/">"Skincare"</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href='#/add-product'>Add Product</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav>
            <b-nav-item-dropdown right v-if="this.$cookie.get('session')">
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>Hello {{this.$cookie.get('firstName')}} {{this.$cookie.get('lastName')}}</em>
              </template>
              <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item v-if="!this.$cookie.get('session')" href="#/login">Login</b-nav-item>
            <b-nav-item v-if="!this.$cookie.get('session')" href="#/register">Register</b-nav-item>
          </b-navbar-nav> 
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      user: {}
    }
  },
  methods: {
    logout() {
      this.$cookie.delete('session');
      this.$cookie.delete('firstName');
      this.$cookie.delete('lastName');
      this.$cookie.delete('email');

      this.$router.push('/login');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
