import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
// 引入用户管理组件
import Users from '@/components/Users'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,

      // 在Home路由中配置子路由
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    }
  ]
})

// 给router对象注册导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // console.log(to)
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
