<template>
  <div>
  	<h3> Add a new product </h3>
    <b-container class="bv-row">
      <b-row>
        <b-col md="8" offset-md="2">
          <b-form>
            <b-form-group>
              <b-form-input type="text"
                            class="input85"
                            id="productName"
                            v-model="productName"
                            required
                            placeholder="Product Name">
              </b-form-input>
            </b-form-group>
          </b-form>
          <div>
            <b-form-select v-model="selectedCategory" :options="categories" class="input85" />
            <div>{{selectedCategory}}</div>
          </div>
          <h5> Ingredients 
          </h5>
          
          <div class="container-fluid">
            <draggable v-model="ingredients">
              <transition-group name="list-complete">
                <div v-for="(ingredient, index) in ingredients" 
                     v-bind:key="ingredient.id"
                     class="list-complete-item" 
                     v-on:click="select(index)"
                     v-bind:class="{ selected: ingredients[index].selected }"
                >
                  <div> {{ ingredient.name }} </div>
                </div>
              </transition-group>
            </draggable>
          </div>
          <b-row class="modifiers">
            <b-col md="8" offset-md="2">
              <b-form-input class="input" v-model="ingredientName"
                                type="text"
                                placeholder="Add an ingredient"
                                @keydown.native="keydownHandler">
              </b-form-input>
              <icon name="plus-square" 
                    scale=2 
                    color="#33D1FF" 
                    v-on:click.native="addIngredient()"
                    v-b-tooltip.hover
                    title="Add new ingredient">
              </icon>
              <icon name="minus-square" 
                    scale=2 
                    color="#FF5533" 
                    v-on:click.native="deleteSelected()"
                    v-b-tooltip.hover
                    title="Delete selected ingredient(s)">        
              </icon> 
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-button class="button" size="md" variant="primary" @click="addProduct()">
      Submit
    </b-button>
    <p v-if="errors.length">
      <ul style="color:red">
        <li v-for="(error,index) in errors" :key='index'>{{ error }}</li>
      </ul>
    </p> 
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import _ from 'lodash'

export default {
  name: 'Login',
  components: { draggable },
  data () {
    return {
      productName: '',
      ingredientName: '',
      ingredients: [],
      count: 0,
      selectedCategory: null,
      categories: [
        {value: null, text: 'Choose a category'},
        {value: 'Moisturizers', text: 'Moisturizers'},
        {value: 'Cleansers', text: 'Cleansers'},
        {value: 'Serums', text: 'Serums'},
        {value: 'Toners', text: 'Toners'},
        {value: 'Exfoliators', text: 'Exfoliators'},
        {value: 'Masks', text: 'Masks'},
        {value: 'Sunscreens', text: 'Sunscreens'},
        {value: 'Lip Treatments', text: 'Lip Treatments'},
        {value: 'Face Oils', text: 'Face Oils'},
        {value: 'Acne Treatments', text: 'Acne Treatments'}
      ],
      errors: []
    }
  },
  methods: {
    addProduct() {
      this.errors = [];
      if(this.productName === '') {
        this.errors.push('Please enter a product name');
      }
      if(!this.ingredients.length) {
        this.errors.push('Please enter at least one ingredient');
      }

      if(!this.errors.length) {
        var product = {
          name: this.productName,
          ingredients: this.ingredients,
          category: this.selectedCategory
        }
        console.log(product);
        console.log('Adding new product');
      }
    },
    addIngredient() {
      if(this.ingredientName !== '') {
        var ingredient = this.ingredientName;
        this.ingredients.push({name: ingredient, id: this.count++, selected: false});
        this.ingredientName = '';
      }
    },
    keydownHandler(event) {
      if(event.which === 13) {
        this.addIngredient();
      }
    },
    select(index) {
      this.ingredients[index].selected = !this.ingredients[index].selected;
    },
    deleteSelected() {
      var unselected = [];
      for(var ingredient of this.ingredients) {
        if(!ingredient.selected) {
          unselected.push(ingredient);
        }
      }
      this.ingredients = unselected;
    },
    click() {
      console.log("click")
    }
  }
}
</script>

<style>
  .list-complete-item {
    padding: 10px;
    margin: 4px;
    border: solid 1px lightgray;
    transition: all 1s;
    display: inline-block;
  }

  .list-complete-enter, .list-complete-leave-active {
    opacity: 0;
  }

  .selected {
    background-color: #33D1FF;
    color:white;
  }

  .input {
    display: inline;
    width:60%;
  }

  .input85 {
    width:80%;
    margin-left:10%;
    margin-right:10%;
  }

  svg {
    display: inline; 
    margin-left: 2px;
    margin-right: 0.5em;
    vertical-align: middle;
  }

  h3, .container-fluid {
    margin-top: 1em;
  }

  h5 {
    margin-top: 1em;
  }

  .button, .modifiers {
    margin-top: 2em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
