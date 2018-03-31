<template>
  <div>
    <b-container class="bv-row">
      <b-row class="justify-content-md-center">
        <b-col md="6">
            <h1>{{ name }}</h1>
            <p>
              <h5> Ingredients </h5>
              <b-list-group v-for="ingredient in ingredients">
                <b-list-group-item>{{ ingredient.name }}</b-list-group-item>
              </b-list-group>
            </p>
        </b-col>
        <b-col md="4">
          <b-img src="http://via.placeholder.com/300x200" fluid alt="Responsive Image" />

          <b-button class="button" variant='primary' v-if="!userOwnsProduct" @click="addProduct()">I own this product</b-button>
          <b-button class="button" variant='danger' v-else @click="removeProduct()">I don't own this product</b-button>

          <b-button class="button" variant='danger' v-if="!userFlaggedProduct" @click="flagBadProduct()">
            Product doesn't work for me!
          </b-button>
          <b-button class="button" variant='primary' v-else @click="unflagBadProduct()">
            Unflag bad product
          </b-button>          

        </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      name: this.$route.params.product,
      ingredients: [
      {
        name: 'Hydraulic Acid',
      },
      {
        name: 'Tea Tree Oils'
      },
      {
        name: 'Glycolic Acid'
      },
      {
        name: 'Almond Oil'
      }],
      userOwnsProduct: false,
      userFlaggedProduct: false
    }
    
  },
  methods: {
    addProduct() {
      this.userOwnsProduct = true;
    },
    removeProduct() {
      this.userOwnsProduct = false;
      //add removeproduct method
    },
    flagBadProduct() {
      this.userFlaggedProduct = true;
    },
    unflagBadProduct() {
      this.userFlaggedProduct = false;
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
