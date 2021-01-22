// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: '拉勾教育',
  siteDescription: '大前端',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'BlogPost',
        // 抓取文件的路径，即抓取哪些文件
        path: './content/blog/**/*.md',
      }
    },
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: 'http://localhost:1337', // 接口地址
        queryLimit: 1000, // Defaults to 100
        contentTypes: ['posts', 'tags'], // 查询的数据类型
        // typeName: 'Strapi',
        // singleTypes: ['impressum'], // 单个节点
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        loginData: { // 登录信息
          identifier: 'alison_li',
          password: '123456'
        }
      }
    }
  ],
  templates: { // 配置模板
    // StrapiPost 表示 gridsome/source-strapi 插件生成的 集合名称：typeName + contentTypes
    StrapiPosts: [
      {
        path: '/posts/:id',
        component: './src/templates/Post.vue'
      }
    ],
    StrapiTags: [
      {
        path: '/tags/:id',
        component: './src/templates/Tag.vue'
      }
    ]
  }
}
