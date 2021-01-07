<template>
  <div id="app">
      <h1>Hello Nuxt.js!</h1>
  </div>
</template>

<script>
export default {
    name: 'App',
    // 通过 layout 属性，指定自定义组件
    layout: 'foo'
    // 设置所有的组件的父组件，都作用于默认组件
    // layout: 'default'
}
</script>

<style>

</style>