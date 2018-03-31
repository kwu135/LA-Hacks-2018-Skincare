<template>
  <div>
    <b-container class="bv-row">
      <b-row>
        <b-col md="4" offset-md="4">
          <br>
          <b-form>
            <b-form-group id="emailGroup">
              <b-form-input type="email" 
                            id="email"
                            v-model="credentials.email"
                            required
                            placeholder="Email">
              </b-form-input>
            </b-form-group>
            <b-form-group id="passGroup">
              <b-form-input type="password" 
                            id="username"
                            v-model="credentials.password"
                            required
                            placeholder="Password">
              </b-form-input>
            </b-form-group>
            <b-button size="sm" variant="primary" @click="login()">
              Login
            </b-button>
          </b-form>
          <p v-if="errors.length">
            <ul style="color:red">
              <li v-for="(error,index) in errors" :key='index'>{{ error }}</li>
            </ul>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import md5 from 'js-md5';

export default {
  name: 'Login',
  mounted: function(){
    // If the user is already logged in, redirect to home
    this.redirectIfLoggedIn();
  },
  data () {
    return {
      credentials: {
        email: '',
        password: ''
      },
      errors: []
    }
  },
  methods: {
    redirectIfLoggedIn() {
      if(this.$cookie.get('session')) {
        this.$router.push('/');
      }
    },
    login() {
      this.errors = [];

      if(this.credentials.email === '') {
        this.errors.push("Please enter your email");
      }

      if(this.credentials.password === '') {
        this.errors.push("Please enter your password");
      }

      if(!this.errors.length) {
        // TO-DO
        var credentials = {
          email: this.credentials.email,
          password: md5(this.credentials.password)
        }
        console.log('Logging in');

        // Register cookies
        this.$cookie.set('firstName', 'Yuna', 1);
        this.$cookie.set('lastName', 'Lee', 1);
        this.$cookie.set('session', '120sd9f23iw', 1);
        this.$router.push('/');
      }
    }
  }
}
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>

