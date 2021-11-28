import createEditor from './editor'
import background from './better.png'
import './global.css'

const editor = createEditor()
document.body.appendChild(editor)

const img = new Image()
img.src = background
document.body.appendChild(img)

// ============ 以下用于处理 HMR，与业务代码无关 ============

// console.log(createEditor)

// module.hot 对象，是 HMR API 的核心对象
if (module.hot) {
  // 记录这一次的替换模块
  let lastEditor = editor
  /**
   * accept()，用于注册模块更新过后的处理函数
   * 第一个参数，指的是 依赖模块的路径
   * 第二个参数，指的是 依赖更新过后的处理函数
   */ 
  // JS 模块热替换
  module.hot.accept('./editor', () => {
    // console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
    // console.log(createEditor)

    // 重新创建元素
    // 保存上一次的状态
    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })

  // 图片模块热替换
  module.hot.accept('./better.png', () => {
    img.src = background
    console.log(background)
  })
}
