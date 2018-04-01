<template>
  <div>
    <b-container class="bv-row">
      <b-row>
        <b-col md="4" offset-md="4">
          <br>
          <b-form>
            <b-form-group>
              <b-form-input type="text" 
                            id="firstName"
                            v-model="credentials.firstName"
                            required
                            placeholder="First Name">
              </b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input type="text" 
                            id="lastName"
                            v-model="credentials.lastName"
                            required
                            placeholder="Last Name">
              </b-form-input>
            </b-form-group>
            <b-form-group id="emailGroup">
              <b-form-input type="email" 
                            id="email"
                            v-model="credentials.email"
                            required
                            placeholder="Email">
              </b-form-input>
            </b-form-group>
            <b-form-group id="pass1">
              <b-form-input type="password" 
                            id="password"
                            v-model="credentials.password"
                            required
                            placeholder="Password">
              </b-form-input>
            </b-form-group>
            <b-form-group id="pass2">
              <b-form-input type="password" 
                            id="passwordConfirm"
                            v-model="credentials.passwordConfirm"
                            required
                            placeholder="Confirm Password">
              </b-form-input>
            </b-form-group>
            <b-button size="md" variant="info" @click="register()">
              Register
            </b-button>
          </b-form>
        </b-col>
        <b-col md="4" offset-md="4">
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
  name: 'Register',
  mounted: function(){
    // If the user is already logged in, redirect to home
    this.redirectIfLoggedIn();
  },
  data () {
    return {
      credentials: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
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
    register() {
      this.errors = [];

      if(this.credentials.firstName === '' || this.credentials.lastName === '') {
        this.errors.push("First and last name fields cannot be empty");
      }

      if(this.credentials.email === '' || this.credentials.password === ''
          || this.credentials.passwordConfirm === '') {
        this.errors.push("Email and password fields cannot be empty");
      }

      if(!this.credentials.email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i)) {
        this.errors.push("Please enter a valid email");
      }

      if(this.credentials.password != this.credentials.passwordConfirm) {
        this.errors.push("Passwords don't match, please try again");
      } 

      if(!this.errors.length) {
        var credentials = {
          fname: this.credentials.firstName,
          lname: this.credentials.lastName,
          email: this.credentials.email,
          pw: md5(this.credentials.password)
        }

        this.$http.post('http://35.185.196.137:3000/signup', credentials).then(response => {
        
          if(response.status === 200) {
            if(response.body.success) {
              // get body data
              let data = response.body.data;

              // Register cookies
              this.$cookie.set('firstName', data.fname, 1);
              this.$cookie.set('lastName', data.lname, 1);
              this.$cookie.set('session', data.sessionToken, 1);
              this.$cookie.set('email', data.email, 1);
              this.$router.push('/');
            }
          }
        
        }, response => {
          // error callback
          console.log("Failed to signup: " + response);
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