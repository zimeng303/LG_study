<template>
    <button> {{ text }} </button>
</template>

<!-- 设置 lang="ts"，表示使用 TS 语言 -->
<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from "vue-property-decorator";

@Component({})
export default class Button extends Vue {
    @Prop() readonly size: string = 'md'

    private text: string = 'hello'

    onCLick () {
        console.log(this.text);
    }

    mounted () {
        // 生命周期方法
    }
}

// Vue 2.0 使用基础 Vue 构造器(Vue.extend())，创建一个“子类”。
// Vue 3.0 使用 defineComponent()
// export default Vue.extend({
//     data () {
//         return {
//             text: 'button'
//         }
//     }
// })

// 如果使用 class-style 创建组件，
// 组件内部需要导出一个继承自 Vue 类型的 class
// 而且这个类型需要使用 vue-class-component 装饰器 修饰

// class-style 最大的问题：
// 有些选项必须要使用 装饰器参数传递 （又回到原始状态）
// import Component from "vue-class-component";

// 装饰器，内部做了一些写法上的转换，如 属性 转换成 data，方法 转换成 methods
// @Component({
//     // data () {
//     //     return {
//     //         text: 'button'
//     //     }
//     // },
//     // methods: {
//     //     onClick () {
//     //         console.log(this.text);            
//     //     }
//     // }
// })
// export default class Button extends Vue {
//     private text: string = 'hello'

//     onCLick () {
//         console.log(this.text);
//     }

//     mounted () {
//         // 生命周期方法
//     }
// }

// function myDect (myClass) {
//     return 1
// }

</script>

<style>

</style>