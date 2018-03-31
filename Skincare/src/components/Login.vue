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
      }
    }
  },
  methods: {
    login() {
      var credentials = {
        email: this.credentials.email,
        password: this.credentials.password
      }
    }
  }
}
</script>

