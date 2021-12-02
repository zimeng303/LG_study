import { registerApplication, start } from "single-spa";

import { constructApplications, constructRoutes } from "single-spa-layout"
// 获取路由配置对象
const routes = constructRoutes(document.querySelector("#single-spa-layout"))
// 获取路由信息数组
const applications = constructApplications({
    routes,
    loadApp({ name }) {
        return System.import(name)
    }
})
// 遍历路由信息注册应用
applications.forEach(registerApplication)

/*
    注册微前端应用
    1. name: 字符串类型, 微前端应用名称 "@组织名称/应用名称"
    2. app: 函数类型, 返回 Promise, 通过 systemjs 引用打包好的微前端应用模块代码
    (umd)
    3. activeWhen: 路由匹配时激活应用
*/
/* registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: ["/"],
}); */

/* registerApplication(
  "@single-spa/welcome", 
  () => 
  System.import(
  "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
  ),
  location => location.pathname === "/"
) */
 
/* registerApplication({
  name: "@study/lagou",
  app: () => System.import("@study/lagou"),
  activeWhen: ["/lagou"]
}); */

/* registerApplication({
  name: "@study/todos",
  app: () => System.import("@study/todos"),
  activeWhen: ["/todos"]
}); */

/* registerApplication({
  name: "@study/realworld",
  app: () => System.import("@study/realworld"),
  activeWhen: ["/realworld"]
}) */

start({
  urlRerouteOnly: true,
});
