<template>
  <div>
    <h1 :style="{ fontSize: fontSize + 'em' }">Props Down Child</h1>
    <button @click="handler">文字增大</button>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: Number
  },
  methods: {
    handler () {
      // 自定义事件 enlargeText
      // this 当前子组件对象，即由子组件触发的自定义事件
      this.$emit('enlargeText', 0.1)
    }
  }
}
</script>

<style>

</style>