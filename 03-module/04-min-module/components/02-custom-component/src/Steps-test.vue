<template>
  <div>
      <steps :count="count" :active="active"></steps>
      <hr />
      <button @click="next">下一步</button>
  </div>
</template>

<script>
import Steps from './Steps'

export default {
    components: {
        Steps
    },
    data () {
        return {
            count: 4,
            active: 0
        }
    },
    methods: {
        next () {
           this.active < this.count && this.active++
        }
    }
}
</script>

<style>

</style>