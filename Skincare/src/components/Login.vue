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
                            placeholder="Password"
                            @keydown.native="keydownHandler">
              </b-form-input>
            </b-form-group>
            <b-button size="md" variant="info" @click="login()">
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
    keydownHandler(event) {
      if(event.which === 13) {
        this.login();
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
          pw: md5(this.credentials.password)
        }

        this.$http.post('http://35.185.196.137:3000/login', credentials).then(response => {
        
          if(response.status === 200){

            if(!response.data.success) {
              this.errors.push(response.data.err);
              return;
            }

            // get body data
            let data = response.body.data;

            // Register cookies
            this.$cookie.set('firstName', data.fname, 1);
            this.$cookie.set('lastName', data.lname, 1);
            this.$cookie.set('session', data.sessionToken, 1);
            this.$cookie.set('email', data.email, 1);
            this.$router.push('/');
          } else {
            this.errors.push("Cannot authenticate. Please try again");
          }
        }, response => {
          // error callback
          this.errors.push("Cannot authenticate. Please try again.");
          console.log(response);
        });
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

