<template>
  <div>
    <br><br>
    <b-container class="bv-row">
      <b-row class="justify-content-md-center">
        <b-col md="6">
            <h1>{{ productName }}</h1>
            <h5> Ingredients </h5>
            <b-list-group v-for="ingredient in ingredients">
              <b-list-group-item>{{ ingredient }}</b-list-group-item>
            </b-list-group>
        </b-col>
        <b-col md="4">
          <b-img src="https://storage.googleapis.com/momento/noun_737023_cc.png" fluid alt="Responsive Image" />

          <b-button class="button" variant='info' v-if="!userOwnsProduct" @click="addProduct()">I use this product</b-button>
          <b-button class="button" variant='danger' v-else @click="removeProduct()">I don't use this product</b-button>

          <b-button class="button" variant='danger' v-if="!userFlaggedProduct" @click="flagBadProduct()">
            Product doesn't work for me!
          </b-button>
          <b-button class="button" variant='info' v-else @click="unflagBadProduct()">
            Nevermind, product works for me!
          </b-button>
        </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
export default {
  name: 'Product',
  mounted: function() {
    this.$http.get(this.baseUrl + '/product-info/?productHash=' + this.productHash).then(response => {
      if(response.status === 200) {
        if(response.body.success) {
          let data = response.body.data;

          this.productName = data.name;
          this.ingredients = data.ingredients;
          this.category = data.category;

          var credentials = {
            productHash: this.productHash,
            email: this.$cookie.get('email'),
            sessionToken: this.$cookie.get('session')
          }
          this.$http.post(this.baseUrl + '/check-product-in-lists', credentials).then(response=> {
            if(response.body.success){
              this.userOwnsProduct = response.body.data.inProductList;
              this.userFlaggedProduct = response.body.data.inFlaggedProductList;

            }
          }, response => {
            console.log("Failed to get list data for product");
          })
        }
      }
    
    }, response => {
      console.log("Failed to load data for product: " + this.productHash);
    });
  },
  data () {
    return {
      productHash: this.$route.params.product,
      productName: '',
      ingredients: [],
      category: '',
      userOwnsProduct: false,
      userFlaggedProduct: false,
      baseUrl: 'http://35.185.196.137:3000'
    }
    
  },
  methods: {
    addProduct() {
      this.userOwnsProduct = true;

      var product = {
        "productHash": this.productHash,
        "email": this.$cookie.get('email'),
        "sessionToken": this.$cookie.get('session'),
      };

      this.$http.post(this.baseUrl + '/add-product-to-routine', product).then(response => {
      
        if(response.status === 200) {
          if(response.body.success) {
            console.log("Added product to current user routine");
          }
        }
      
      }, response => {
        console.log("Failed to add product to list: " + response);
      });
    },
    removeProduct() {
      this.userOwnsProduct = false;
      //remove product method
      var product = {
        "productHash": this.productHash,
        "email": this.$cookie.get('email'),
        "sessionToken": this.$cookie.get('session'),
      };
      this.$http.post(this.baseUrl + '/remove-product-from-routine', product).then(response => {
      
        if(response.status === 200) {
          if(response.body.success) {
            console.log("Removed product from current user's routine");
          }
        }
      
      }, response => {
        console.log("Failed to remove product from list: " + response);
      });
    },
    flagBadProduct() {
      this.userFlaggedProduct = true;
      var product = {
        "productHash": this.productHash,
        "email": this.$cookie.get('email'),
        "sessionToken": this.$cookie.get('session'),
      };
      this.$http.post(this.baseUrl + '/add-threat-flag-to-product', product).then(response => {
      
        if(response.status === 200) {
          if(response.body.success) {
            console.log("Added product flag for breakouts");
          }
        }
      
      }, response => {
        console.log("Failed to flag product: " + response);
      });
    },
    unflagBadProduct() {
      this.userFlaggedProduct = false;
      var product = {
        "productHash": this.productHash,
        "email": this.$cookie.get('email'),
        "sessionToken": this.$cookie.get('session'),
      };
      this.$http.post(this.baseUrl + '/remove-threat-flag-from-product', product).then(response => {
      
        if(response.status === 200) {
          if(response.body.success) {
            console.log("Removed product flag for breakouts");
          }
        }
      
      }, response => {
        console.log("Failed to unflag product: " + response);
      });
    }
  }
}
</script>

<style>
  h1 {
    color: teal;
  }

  .img-fluid {
    margin: 1em;
  }

  .button{
    display: block;
    margin: 1em auto;
  }
</style>
