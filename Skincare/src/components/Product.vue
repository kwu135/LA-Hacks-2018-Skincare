<template>
  <div>
  	<b-container class="bv-row">
  		<b-row>
  			<b-col md="2" align-self="center">
  				<b-img src="http://www.clker.com/cliparts/3/m/v/Y/E/V/small-red-apple-hi.png" fluid alt="Responsive Image" />
  			</b-col>
  			<b-col md="6">
			    	<h1>{{ title }}</h1>
			    	<p>
				    	<b-list-group v-for="ingredient in ingredients">
				    		<b-list-group-item>{{ ingredient }}</b-list-group-item>
				    	</b-list-group>
			    	</p>
			</b-col>
			<b-col md="4" align-self="center">
				<b-button class="button" variant='danger' @click="badProduct()">Product does not work for me!</b-button>
				<b-button class="button" variant='danger' @click="removeProduct()">Remove Product </b-button>
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
      title: 'Product ' + this.$route.params.product,
      ingredients: {
    	abc: 'Hydraulic Acid',
    	def: 'Tea Tree Oil',
    	xyz: 'Glycolic Acid',
    	ddd: 'Almond Oil'
   	  }
    }
    
  },
  methods: {
  	badProduct(){
  		//add badproduct method
  	},
  	removeProduct(){
  		//add removeproduct method
  		
  	}
  }
}
</script>

<style>
	h1 {
		color: teal;
	}
	.button{
		display: block;
		margin: auto;
		float: center;
	}
</style>