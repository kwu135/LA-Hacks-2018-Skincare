<template>
  <div>
  	<h3> Add a new product </h3>
    <b-container class="bv-row">
      <b-row>
        <b-col md="8" offset-md="2">
          <b-form>
            <b-form-group>
              <b-form-input type="text"
                            id="productName"
                            v-model="productName"
                            required
                            placeholder="Product Name">
              </b-form-input>
            </b-form-group>
          </b-form>
          <h5> Ingredients 
          </h5>
          <icon name="plus-square" scale=2 color="#33D1FF" v-on:click.native="click()"></icon>
          <icon name="minus-square" scale=2 color="#FF5533" v-on:click.native="deleteSelected()"></icon> 
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
        </b-col>
      </b-row>
    </b-container>
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
      ingredients: [{
        id: 1,
        name: 'Aqua (Water)',
        selected: false
      },{
        id: 2,
        name: 'Cetearyl Alcohol',
        selected: false
      },{
        id: 3,
        name: 'Glycerin',
        selected: false
      },
      {
        id: 4,
        name: 'Aqua (Water)',
        selected: false
      },{
        id: 5,
        name: 'Cetearyl Alcohol',
        selected: false
      },{
        id: 6,
        name: 'Glycerin',
        selected: false
      },
      {
        id: 7,
        name: 'Aqua (Water)',
        selected: false
      },{
        id: 8,
        name: 'Cetearyl Alcohol',
        selected: false
      },{
        id: 9,
        name: 'Glycerin',
        selected: false
      }],
      errors: []
    }
  },
  methods: {
    addProduct() {
    },
    addIngredient() {
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
    background-color: grey;
  }

  svg, h5{
    display: inline; 
    margin-right: 10px;
  }
</style>
