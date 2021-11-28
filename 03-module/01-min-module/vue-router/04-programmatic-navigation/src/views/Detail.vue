<template>
  <div>
    路由参数：{{ id }}

    <button @click="go"> go(-2) </button>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['id'],
  methods: {
    go () {
      // 跳转到历史中的某一次，即后退到哪一次
      // -1 表示回退到上个页面，-2表示回退到上上个页面...
      this.$router.go(-2)
    }
  }
}
</script>

<style>

</style>
