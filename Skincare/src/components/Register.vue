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
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul style="color:red">
              <li v-for="error in errors">{{ error }}</li>
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
      if(this.credentials.password != this.credentials.passwordConfirm) {
        this.errors.push("Passwords don't match, please try again");
      } else {
        var credentials = {
          email: this.credentials.email,
          password: this.credentials.password
        }
      }
    }
  }
}
</script>

