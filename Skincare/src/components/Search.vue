<template>
  <div>
    <h3> Search through existing products in our database </h3>
    <b-container class="bv-row">
      <b-row>
        <b-col md="8" offset-md="2">
          <b-form-group
              id="searchField"
              label-for="searchInput"
          >
            <b-form-input id="searchInput" 
                          v-model.trim="searchQuery"
                          placeholder="Enter your search here"
                          @keydown.native="keydownHandler">            
            </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
        <b-col md="8" offset-md="2">
          <b-card bg-variant="light" header="Results">
          </b-card>
        </b-col>
      <b-row>

      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      searchQuery: '',
      results: []
    }
  },
  methods: {
    search() {
      if(this.searchQuery.trim!=='') {
        console.log(this.searchQuery);
      }
    },
    keydownHandler(event) {
      if(event.which === 13) {
        this.search();
      }
    }
  }
}
</script>

<style>
  #searchField {
    margin-left:4%;
    margin-right:4%;
  }
</style>