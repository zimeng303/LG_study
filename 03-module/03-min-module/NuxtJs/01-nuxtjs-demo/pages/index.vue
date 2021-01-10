<template>
  <div id="app">
      <h1>{{ title }}</h1>
      <foo :posts="posts" />
  </div>
</template>

<script>
import axios from 'axios'
import Foo from '@/components/Foo'
export default {
    name: 'HomePage',
    components: {
      Foo
    },
    async asyncData () {
      const res = await axios({
        method: 'GET',
        url: 'http://localhost:3000/data.json'
      })
      return res.data
    }
}
</script>

<style>

</style>