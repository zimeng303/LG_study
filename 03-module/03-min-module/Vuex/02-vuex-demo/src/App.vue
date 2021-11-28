<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count: {{ $store.state.count }} <br />
    msg: {{ $store.state.msg }} -->
    <!-- count: {{ count }} <br />
    msg: {{ msg }} -->
    count: {{ num }} <br />
    msg: {{ message }}

    <h2>Getter</h2>
    <!-- reverseMsg: {{ $store.getters.reverseMsg }} -->
    reverseMsg: {{ reverseMsg }}

    <h2>Mutation</h2>
    <!-- $store.commit() 提交 mutation -->
    <!-- 参数1：increate 是 mutation 中方法的名字，相当于事件的名称 -->
    <!-- 参数2：2 是方法中除 state 外的其他参数 payload 的值，依次往后 -->
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>

    <h2>Action</h2>
    <!-- Action 的调用要通过 dispatch -->
    <!-- Mutation 的调用要通过 commit -->
    <!-- <button @click="$store.dispatch('increateAsync', 5)">Action</button> -->
    <button @click="increateAsync(6)">Action</button>

    <h2>Module</h2>
    <!-- 从全局的 store 中获取 -->
    <!-- products: {{ $store.state.products.products }} <br />
    <button @click="$store.commit('setProducts', [])">Mutation</button> -->

    <!-- 根据命名空间，从模块中获取 -->
    products: {{ products }} <br />
    <button @click="setProducts([])">Mutation</button>
  </div>
</template>

<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    // 传入的对象的属性，是最终生成的计算属性的名称
    // 属性值，是映射的状态属性
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg']),
    // 当存在相同变量名时，需要传入对象的形式，进行改名，
    // 属性值：新的变量名，属性值：映射的状态属性
    ...mapGetters({
      reverse: 'reverseMsg'
    }),
    // 参数1：模块名称 (命名空间)，参数2：数组，映射模块中的state
    ...mapState('products', ['products'])
  },
  methods: {
    // 把 this.increate() 映射为 this.$store.commit('increate')
    // 将 mutation 中的方法，添加到当前组件的 methods 中
    ...mapMutations(['increate']),
    // 把 this.increate() 映射为 this.$store.dispatch('increateAsync')
    ...mapActions(['increateAsync']),

    // 参数1：模块名称(命名空间)，参数2：数组，映射模块中的 mutation
    ...mapMutations('products', ['setProducts'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
