<template>
  <div>
    <!-- 作为所有组件的父组件，即基础组件 -->
    <ul>
      <li>
        <!-- 类似于 router-link，用于单页面应用导航 -->
        <nuxt-link to="/">Home</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/about">About</nuxt-link>
      </li>
    </ul>
    <!-- 子页面出口，类似于 router-view -->
    <nuxt />
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>