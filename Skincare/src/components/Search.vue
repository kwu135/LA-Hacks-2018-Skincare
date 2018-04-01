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
          <b-card bg-variant="light" header="Search results">
            <b-card-group deck v-for="(product,index) in results"
                  v-on:click="redirect(product.hash)">
              <b-card>
                <div class="row-flexbox">
                  <div class="row-flexbox-box">
                    <img src="https://storage.googleapis.com/momento/noun_737023_cc.png" class="product-card-img">
                  </div>
                  <div class="row-flexbox-box search">
                    <h3 class="card-text">
                      {{ product.name }}
                    </h3>
                    <p>
                      {{ product.category }}
                    </p>
                  </div>
                </div>
              </b-card>
            </b-card-group>
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
        this.$http.get('http://35.185.245.119:3000/product-search/?q=' + this.searchQuery).then(response => {
          if(response.status === 200) {
            if(response.body.success) {
              let data = response.body.data;

              this.results = data;
            }
          }
        }, response => {
          console.log("Failed to load data for product: " + this.productHash);
        });
      }
    },
    keydownHandler(event) {
      if(event.which === 13) {
        this.search();
      }
    },
    redirect(hash) {
      if(hash && hash!='') {
        this.$router.push('/product/' + hash);
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

  .product-card-img {
    height: 100px;
  }

  .row-flexbox {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .row-flexbox-box {
    flex: 1;
  }

  .card {
    margin-bottom: 1.25rem !important;
  }

  .search .card-text {
    color: teal;
  }
</style>