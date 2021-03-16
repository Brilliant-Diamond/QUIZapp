import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Signup from "../views/Signup.vue"
import Signin from "../views/Signin.vue"
import QuizPost from "../views/QuizPost.vue"
import ChallengeQuiz from "../views/ChallengeQuiz.vue"
import Aboutothers from "../views/Aboutothers.vue"
import firebase from "firebase"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/quizpost",
    name: "QuizPost",
    component: QuizPost,
  },
  {
    path: "/challengequiz",
    name: "ChallengeQuiz",
    component: ChallengeQuiz,
  },
  {
    path: "/aboutothers/:id",
    name: "Aboutothers",
    component: Aboutothers,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  let currentUser = firebase.auth().currentUser
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (!currentUser) {
      next({
        path: "/signin",
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router
