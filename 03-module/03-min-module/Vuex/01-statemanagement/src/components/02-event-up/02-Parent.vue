<template>
  <div>
    <h1 :style="{ fontSize: hFontSize + 'em'}">Event Up Parent</h1>

    这里的文字不需要变化

    <!-- 给子组件注册自定义事件 enlargeText -->
    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <!-- $event 为触发自定义事件时，传递的值 -->
    <child :fontSize="hFontSize" v-on:enlargeText="hFontSize += $event"></child>
  </div>
</template>

<script>
import child from './02-Child'
export default {
  components: {
    child
  },
  data () {
    return {
      hFontSize: 1
    }
  },
  methods: {
    // 子组件把值传递给父组件
    enlargeText (size) {
      this.hFontSize += size
    }
  }
}
</script>

<style>

</style>