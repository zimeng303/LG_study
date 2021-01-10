<template>
  <div>
    <h1>FooPage</h1>
    <ul>
      <li v-for="item in posts" :key="item.id">
        <nuxt-link :to="'/article/' + item.id ">
          {{ item.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FooPage",
  props: ["posts"],
};
</script>

<style>
</style>