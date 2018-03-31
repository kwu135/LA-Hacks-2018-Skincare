<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      title: 'Product ' + this.$route.params.product
    }
  }
}
</script>