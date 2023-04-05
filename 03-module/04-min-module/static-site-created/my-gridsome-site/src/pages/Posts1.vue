<template>
  <div>
      <h1>Posts Page</h1>
      <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Posts1',
    data () {
        return {
            posts: []
        }
    },
    async created () {
        const { data } = await axios.get('http://jsonplaceholder.typicode.com/posts')
        this.posts = data
    }
}
</script>

<style>

</style>