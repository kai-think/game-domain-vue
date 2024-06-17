import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'first',
    component: () => import("@/views/first/First.vue")
  },
  {
    path: '/person/:userId',
    name: 'OtherPerson',
    component: () => import("@/views/person/Person.vue"),
    children: [
      {
        path: 'circle',
        name: 'OtherPersonCircle',
        component: () => import("@/views/person/modules/PersonCircle.vue")
      },
      {
        path: 'draft',
        name: 'OtherPersonDraft',
        component: () => import("@/views/person/modules/PersonDraft.vue")
      },
      {
        path: 'follow',
        name: 'OtherPersonFollow',
        component: () => import("@/views/person/modules/PersonFollow.vue")
      },
      {
        path: 'deleted',
        name: 'OtherPersonDeleted',
        component: () => import("@/views/person/modules/PersonDeleted.vue")
      },
    ]
  },
  {
    path: '/personinfo',
    name: 'PersonInfo',
    component: () => import("@/views/person/PersonInfo.vue"),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/person/modules/Login.vue")
  },
  {
    path: '/circle/:id',
    name: 'game-circle',
    component: () => import("@/views/circle/GameCircle.vue")
  },
  {
    path: '/article/edit/:articleId',
    name: 'ArticleEditorDraft',
    component: () => import("@/views/circle/ArticleEditor.vue")
  },
  {
    path: '/circle/:id/article/edit',
    name: 'ArticleEditor',
    component: () => import("@/views/circle/ArticleEditor.vue")
  },
  {
    path: '/circle/article/:id',
    name: 'game-circle-article',
    component: () => import("@/views/circle/GameArticle.vue")
  },
  {
    path: "/forum/:id",
    name: "game-forum",
    component: () => import("@/views/forum/GameForum.vue")
  },
  {
    path: '/forum/post/:id',
    name: 'game-forum-post',
    component: () => import("@/views/forum/GamePost.vue")
  },
  {
    path: '/forum/:id/post/edit',
    name: 'game-forum-post-edit',
    component: () => import("@/views/forum/PostEditor.vue")
  },
  {
    path: '/forum/post/edit/:postId',
    name: 'PostEditor',
    component: () => import("@/views/forum/PostEditor.vue")
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
