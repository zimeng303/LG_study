export const createReactInstance = fiber => {
  let instance = null
  if (fiber.tag === "class_component") {
    // 类组件
    instance = new fiber.type(fiber.props)
  } else {
    // 函数组件
    instance = fiber.type
  }
  return instance
}