<template>
<!-- 	<div class="container">
		<div class="row justify-content-md-center">
			<div class="col col-lg-6">
				<b-card-group deck>
					<div v-for="product in products">
						<b-card 
							title="Card title"
							sub-title="Card subtitle"
							class="product-card">
						<img src="https://storage.googleapis.com/momento/default_product.png" class="product-card-img">
						<p class="card-text">
							{{ product.name }}
							Some quick example text to build on the <em>card title</em> and make up the bulk of the card's content.
						</p>
						<a href="#"
						   class="card-link">Card link</a>
						<b-link href="#"
								class="card-link">Another link</b-link>
						</b-card>
					</div>
				</b-card-group>
			</div>
		</div>
	</div> -->
	<div>
		<b-container>
			<b-row class="pt-3">
				<b-col md="12" align="left">
					<h1>Current Regimen</h1>
				</b-col>
			</b-row>
			<b-row v-for="i in Math.ceil(products.length / 3)">
				<b-col md="12">
					<b-card-group deck>
						<b-card align="center" v-for="(product,index) in products.slice((i - 1) * 3, i * 3)">
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
			<!-- <b-row>
				<b-col>
					<b-button variant="success lg" class="btn-block">+</b-button>
				</b-col>
			</b-row> -->
			<b-row>
				<b-col md="12" align="left" class="py-2">
					<h1>Didn't Work</h1>
				</b-col>
			</b-row>
			<b-row v-for="i in Math.ceil(products.length / 3)">
				<b-col md="12">
					<b-card-group deck>
						<b-card 
							bg-variant="danger" 
							text-variant="white" 
							align="center" 
							v-for="(product,index) in products.slice((i - 1) * 3, i * 3)">
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
							<b>{{ harmfulIngredient.name }}<br /></b>
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
export default {
	name: 'Home',
	data () {
		return {
			title: 'Default home page',
			products: [
				{
					name: 'Product 1',
					ingredients: [
						'Water',
						'Stuff'
					]
				},
				{
					name: 'Product 2',
					ingredients: [
						'Fire',
						'Not Stuff'
					]
				},
				{
					name: 'Product 1',
					ingredients: [
						'Water',
						'Stuff'
					]
				},
				{
					name: 'Product 2',
					ingredients: [
						'Fire',
						'Not Stuff'
					]
				},
				{
					name: 'Product 1',
					ingredients: [
						'Water',
						'Stuff'
					]
				},
				{
					name: 'Product 2',
					ingredients: [
						'Fire',
						'Not Stuff'
					]
				}
			],
			harmfulIngredients: [
				{
					name: 'Ingredient 1'
				},
				{
					name: 'Ingredient 2'
				}
			]
		}
	}
}
</script>
