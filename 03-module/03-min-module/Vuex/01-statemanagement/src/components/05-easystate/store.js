export default {
  debug: true,
  // state 存储数据
  state: {
    user: {
      name: 'xiaomao',
      age: 18,
      sex: '男'
    }
  },
  // action 当视图和用户交互的时候，进行状态的更改
  setUserNameAction (name) {
    if (this.debug) {
      console.log('setUserNameAction triggered：', name)
    }
    this.state.user.name = name
  }
}