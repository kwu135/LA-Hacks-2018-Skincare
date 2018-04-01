<template>
	<div>
		<b-container>
			<b-row class="pt-3">
				<b-col md="12" align="left">
					<h1>Current Regimen</h1>
				</b-col>
			</b-row>
			<b-row v-for="i in Math.ceil(routineProducts.length / 3)">
				<b-col md="12">
					<b-card-group deck>
						<b-card align="center" 
								v-for="(product,index) in routineProducts.slice((i - 1) * 3, i * 3)"
								v-on:click="redirect(product.hash)">
							<div class="row-flexbox">
								<div class="row-flexbox-box">
									<img src="https://storage.googleapis.com/momento/noun_737023_cc.png" class="product-card-img">
								</div>
								<div class="row-flexbox-box">
									<p class="card-text">
										{{ product.name }}
									</p>
								</div>
							</div>
						</b-card>
					</b-card-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col md="12" align="left" class="py-2">
					<h1>Didn't Work</h1>
				</b-col>
			</b-row>
			<b-row v-for="i in Math.ceil(threatProducts.length / 3)">
				<b-col md="12">
					<b-card-group deck>
						<b-card 
							bg-variant="danger" 
							text-variant="white" 
							align="center" 
							v-for="(product,index) in threatProducts.slice((i - 1) * 3, i * 3)"
							v-on:click="redirect(product.hash)">
							<div class="row-flexbox">
								<div class="row-flexbox-box">
									<img src="https://storage.googleapis.com/momento/noun_737023_cc.png" class="product-card-img">
								</div>
								<div class="row-flexbox-box">
									<p class="card-text">
										{{ product.name }}
									</p>
								</div>
							</div>
						</b-card>
					</b-card-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col md="12" align="left" class="py-2">
					<h1>Potentially Harmful Ingredients</h1>
				</b-col>
			</b-row>
			<b-row v-for="harmfulIngredient in harmfulIngredients">
				<b-col md="12">
					<b-card 
						class="my-1"
						bg-variant="danger"
						text-variant="white"
						align="left">
						<p class="card-text">
							<b>{{ harmfulIngredient }}<br /></b>
						</p>
					</b-card>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<style>
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
</style>

<script>
import md5 from 'js-md5';

export default {
	name: 'Home',
	mounted: function() {
		if(!this.$cookie.get('session')) {
			this.$router.push('/login');
		}

		var baseUrl = 'http://35.185.245.119:3000'

		var credentials = {
			email: this.$cookie.get('email'),
			sessionToken: this.$cookie.get('session'),
		};
		this.$http.post(baseUrl + '/get-product-lists',credentials).then(response => {
		  if(response.status === 200) {
		    if(response.body.success) {
		      var routines = response.body.data.productList;
		      var threats = response.body.data.flaggedProductList;
		      routines.forEach((product)=> {
		      	this.routineProducts.push({name: product, hash: md5(product)});
		      });
		      threats.forEach((threat)=> {
		      	this.threatProducts.push({name: threat, hash: md5(threat)});
		      });
		    }
		  }
		}, response => {
		  console.error("Failed to load data for product lists");
		});

		this.$http.post(baseUrl + '/get-threat-ingredients', credentials).then(response => {
			if(response.status == 200 && response.body.success) {
				this.harmfulIngredients = response.body.data;
			}
		}, response => {
			console.error("Failed to get ingredients");
		});
	},
	data () {
		return {
			routineProducts: [],
			threatProducts: [],
			harmfulIngredients: [],
		}
	},
	methods: {
		redirect(hash) {
			hash = hash.substr(0,10);
			this.$router.push('/product/' + hash);
		}
	}
}
</script>
