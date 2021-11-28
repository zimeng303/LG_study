<template>
  <div>
    <h1>ref Child</h1>
    <input ref="input" type="text" v-model="value">
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    focus () {
      // 获取 input 标签，对应的 DOM 对象
      this.$refs.input.focus()
    }
  }
}
</script>

<style>

</style>