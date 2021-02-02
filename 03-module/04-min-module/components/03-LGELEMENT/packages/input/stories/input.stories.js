import LgInput from '../'

// Storybook lists your stories and provides information used by addons
export default {
    title: 'LgInput',
    component: LgInput
}

// 渲染组件，设置组件模板
export const Text = () => ({
    components: { LgInput },
    template: '<lg-input></lg-input>',
    data () {
        return {
            value: 'admin'
        }
    }
})

export const Password = () => ({
    components: { LgInput },
    template: '<lg-input type="password" v-model="value"></lg-input>',
    data () {
        return {
            value: 'admin'
        }
    }
})