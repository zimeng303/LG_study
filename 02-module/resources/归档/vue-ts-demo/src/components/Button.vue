<template>
  <button @click="onClick">{{ text }}</button>
</template>

<script lang="ts">

import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'

@Component({})
export default class Button extends Vue {
  @Prop() readonly size: string = 'md'
  
  private text: string = 'hello'

  //
  get fullText () {
    return `xxx ${this.text}`
  }

  onClick () {
    console.log(this.text)
  }

  mounted () {
    // 生命周期方法
  }
}

// 如果使用 class-style 创建组件，
// 组件内部需要到处一个继承自 Vue 类型的 class
// 而且这个类型需要使用 vue-class-component 装饰器 修饰

// class-style 最大的问题：
// 有些选项必须要使用 装饰器参数传递（又回到原始状态）
// import Vue from 'vue'
// import Component from 'vue-class-component'

// @Component({
//   props: {
//     size: String
//   }
// })
// export default class Button extends Vue {
//   private text: string = 'hello'

//   //
//   get fullText () {
//     return `xxx ${this.text}`
//   }

//   onClick () {
//     console.log(this.text)
//   }

//   mounted () {
//     // 生命周期方法
//   }
// }



// import Vue from 'vue'

// export default Vue.extend({
//   data () {
//     return {
//       text: 'button'
//     }
//   },
//   methods: {
//     foo () {
//       console.log(this.text)
//     }
//   }
// })


// function myDect (myClass) {
//   return 1
// }
</script>

<style>

</style>