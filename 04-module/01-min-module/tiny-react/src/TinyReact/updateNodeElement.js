/** 
 * @description 为元素添加属性
 * @param {*} newElement
 * @param {*} virtualDOM
 * @param {*} oldVirtualDOM
 */
export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {} // [可选] 设置属性时不传，更新属性时传入
) {
  // 获取节点对应的属性对象
  const newProps = virtualDOM.props || {}
  const oldProps = oldVirtualDOM.props || {}
  Object.keys(newProps).forEach(propName => {
    // 获取属性值
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]
    if (newPropsValue !== oldPropsValue) {
      // 判断属性是否是事件属性 onClick -> click
      if (propName.slice(0, 2) === 'on') {
        // 事件名称
        const eventName = propName.toLowerCase().slice(2)
        // 为元素添加事件
        newElement.addEventListener(eventName, newPropsValue)
        // 删除原有的事件的事件处理函数
        if (oldPropsValue) {
          newElement.removeEventListener(eventName, oldPropsValue)
        }
      } else if (propName === 'value' || propName === 'checked') {
        newElement[propName] = newPropsValue
      } else if (propName !== 'children') {
        if (propName === 'className') {
          newElement.setAttribute('class', newPropsValue)
        } else {
          newElement.setAttribute(propName, newPropsValue)
        }
      }
    }
  })

  // 判断属性被删除的情况
  Object.keys(oldProps).forEach(propName => {
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]
    if (newPropsValue) {
      // 属性被删除了
      if (propName.slice(0, 2) === 'on') {
        const eventName = propName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldPropsValue)
      } else if (propName !== 'children') {
        newElement.removeAttribute(propName)
      }
    }
  })
}