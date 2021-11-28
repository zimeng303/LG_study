<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Index</router-link>
    </div>
    <button @click="replace"> replace </button>

    <button @click="goDetail"> Detail </button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    replace () {
      // 不会记录这次历史，即后退按钮不可以点击
      this.$router.replace('/login')
    },
    goDetail () {
      // 记录历史，即后退按钮可以点击，并且把鼠标放在后退按钮上，会显示所有历史
      this.$router.push({ name: 'Detail', params: { id: 1 } })
    }
  }
}
</script>
