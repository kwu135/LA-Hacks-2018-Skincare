<template>
  <div>
    <b-container class="bv-row">
      <b-row>
        <b-col md="4" offset-md="4">
          <br>
          <b-form>
            <b-form-group id="emailGroup">
              <b-form-input type="text" 
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
            <b-button size="sm" variant="primary" @click="register()">
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
export default {
  name: 'Register',
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        passwordConfirm: ''
      },
      errors: []
    }
  },
  methods: {
    register() {
      this.errors = [];

      if(this.credentials.email === '' || this.credentials.password === ''
          || this.credentials.passwordConfirm === '') {
        this.errors.push("Email and password fields cannot be empty");
      }

      if(!this.credentials.email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/)) {
        this.errors.push("Please enter a valid email");
      }

      if(this.credentials.password != this.credentials.passwordConfirm) {
        this.errors.push("Passwords don't match, please try again");
      } 

      if(!this.errors.length) {
        var credentials = {
          email: this.credentials.email,
          password: this.credentials.password
        }
        console.log('Registering...');
        console.log(credentials);
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