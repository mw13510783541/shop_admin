import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
// 引入用户管理组件
import Users from '@/components/users/Users'
// 引入权限管理组件
import Rights from '@/components/rights/Rights'
// 引入角色权限组件
import Roles from '@/components/rights/Roles'
// 引入商品分类组件
import Categories from '@/components/products/Categories'
// 引入商品列表模块
import Goods from '@/components/products/Goods'
// 引入商品添加组件Add.vue
import Add from '@/components/products/Add'

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
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: Add
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
