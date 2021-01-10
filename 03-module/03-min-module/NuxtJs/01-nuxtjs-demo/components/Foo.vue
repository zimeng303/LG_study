<template>
  <div>
      <h1>FooPage</h1>
      <p>{{ foo }}</p>
      <ul>
          <li v-for="item in posts" :key="item.id">
              {{ item.title }}
          </li>
      </ul>
  </div>
</template>

<script>
export default {
    name: 'FooPage',
    props: ["posts"]
    // async asyncData () {
    //     return {
    //         foo: 'bar'
    //     }
    // }
}
</script>

<style>

</style>