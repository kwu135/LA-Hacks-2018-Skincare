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
export default {
  name: 'Login',
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
    login() {
      this.errors = [];

      var credentials = {
        email: this.credentials.email,
        password: this.credentials.password
      }

      if(this.credentials.email === '') {
        this.errors.push("Please enter your username");
      }

      if(this.credentials.password === '') {
        this.errors.push("Please enter your password");
      }

      if(!this.errors.length) {
        // TO-DO
        console.log('Logging in');
      }
    }
  }
}
</script>

