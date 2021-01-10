<template>
  <div id="app">
      <h1>{{ title }}</h1>
      <nuxt-link to="about">About</nuxt-link>
      <br />
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
    // 当你想要动态页面内容，有利于 SEO 或者是 提升首屏渲染速度的时候，就在 asyncData 中发请求获取数据
    async asyncData () {
      console.log('asyncData');
      console.log(this); // undefined
      // 首屏渲染
      const res = await axios({
        method: 'GET',
        url: 'http://localhost:3000/data.json'
      })
      return res.data
    },
    // 如果是非异步数据或者普通数据，则正常的初始化到 data 中即可
    data () {
      return {
        foo: 'bar'
      }
    }
}
</script>

<style>

</style>