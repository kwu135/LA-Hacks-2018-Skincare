<template>
  <div>
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
          <b-img src="http://via.placeholder.com/300x200" fluid alt="Responsive Image" />

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
    this.$http.get(this.baseUrl + '/product-info/' + this.productHash).then(response => {
      if(response.status === 200) {
        if(response.body.success) {
          console.log('Found product hash');
        }
      }
    
    }, response => {
      console.log("Failed to load data for product: " + this.productHash);
    });
  },
  data () {
    return {
      productHash: this.$route.params.product,
      productName: 'OP Moisturizer',
      ingredients: ['Hydraulic Acid',
                    'Tea Tree Oils',
                    'Glycolic Acid',
                    'Almond Oil'],
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
