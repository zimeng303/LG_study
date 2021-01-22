<template>
  <Layout>
      <div>
          <h1>Posts2</h1>
          <ul>
              <li v-for="edge in $page.posts.edges" :key="edge.node.id">
                  <!-- 类似 router-link -->
                  <g-link :to="edge.node.path">{{ edge.node.title }}</g-link>
              </li>
          </ul>
      </div>
  </Layout>
</template>

<page-query>

query {
  posts: allPost {
    edges {
      node {
        id
        title
      }
    }
  }
}
</page-query>


<script>
export default {
    name: 'Posts2'
}
</script>

<style>

</style>