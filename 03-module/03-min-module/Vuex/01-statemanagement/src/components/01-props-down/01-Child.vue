<template>
  <div>
    <h1>Props Down Child</h1>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  // 接收父组件传给子组件的值
  // props: ['title'],
  props: {
    title: String
  }
}
</script>

<style>

</style>