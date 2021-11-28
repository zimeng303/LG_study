<template>
  <div>
    <h1>Post List</h1>
    <ul>
      <li v-for="post in posts" :key="post.sort">{{ post.word }}</li>
    </ul>
  </div>
</template>

<script>
// import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "PostList",
  metaInfo: {
    title: "Posts",
  },
  data() {
    return {
      // posts: [],
    };
  },
  computed: {
    ...mapState(["posts"]),
  },
  // Vue SSR 特殊为服务端渲染提供的一个生命周期钩子函数
  // 在组件渲染之前，进行调用
  serverPrefetch() {
    // 发起 action，返回 Promise
    // this.$store.dispatch('getPosts')
    return this.getPosts();
  },
  methods: {
    ...mapActions(["getPosts"])
  },
  // 服务端渲染
  //     只支持 beforeCreate 和 created
  //     不会等待 beforeCreate 和 created 中的操作
  //     不支持响应式数据
  // 所有这种做法在服务端渲染中是不会工作的
  // async created() {
  //   console.log("Posts Created Start");

  //   const { data } = await axios({
  //     method: "GET",
  //     url: "https://cloud-rest.lenovomm.com/cloud-pc-browser/browser-service-api/stand/weiboList",
  //   });

  //   this.posts = data.data;
  //   console.log("Posts Created End");
  // },
};
</script>

<style>
</style>