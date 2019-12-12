<template>
  <el-container class="home">
  <el-header>
    <div class="logo"></div>
    <div class="logout">
      <span>欢迎光临</span>
      <a href="javascript:;" @click='logout'>退出</a>
    </div>
    <div class="title">电商后台管理系统</div>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <!-- 左侧菜单 -->
       <el-menu
      :default-active="$route.path.slice(1).split('-')[0]"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router>
      <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{menu.authName}}</span>
        </template>
        <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.authName}}</span>
      </el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>管理权限</span>
      </template>
      <el-menu-item index="/roles">
      <i class="el-icon-menu"></i>
      <span slot="title">角色列表</span>
    </el-menu-item>
      <el-menu-item index="/rights">
      <i class="el-icon-menu"></i>
      <span slot="title">权限列表</span>
    </el-menu-item>
    </el-submenu>

     <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>商品管理</span>
      </template>
      <el-menu-item index="3-1">
      <i class="el-icon-menu"></i>
      <span slot="title">商品列表</span>
    </el-menu-item>
      <el-menu-item index="3-2">
      <i class="el-icon-menu"></i>
      <span slot="title">分类参数</span>
    </el-menu-item>
    <el-menu-item index="3-3">
      <i class="el-icon-menu"></i>
      <span slot="title">商品分类 </span>
    </el-menu-item>
    </el-submenu>

    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>订单管理</span>
      </template>
      <el-menu-item index="4-1">
      <i class="el-icon-menu"></i>
      <span slot="title">订单列表</span>
    </el-menu-item>
    </el-submenu> -->

    <!-- <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>数据统计</span>
      </template>
      <el-menu-item index="5-1">
      <i class="el-icon-menu"></i>
      <span slot="title">数据列表</span>
    </el-menu-item>
    </el-submenu> -->

    </el-menu>
    </el-aside>
    <el-main>
      <!-- // 子路由出口 -->
      <router-view></router-view>
    </el-main>
  </el-container>
 </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    logout() {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$message.success('退出成功')
        this.$router.push('/login')
      }).catch(() => {
        this.$message.success('退出取消')
      })
    }
  },
  async created () {
    // 用户登录，动态渲染列表权限
    let res = await this.axios.get('menus')
    let {meta: {status}, data} = res.data
    if (status === 200) {
      // 登陆成功
      this.menuList = data
      // console.log(this.menuList)
      this.$message.success('用户登录成功')
    }
  }
}
</script>

<style lang='less' scoped>
  .home{
    height: 100%;
    .el-header{
      width: 100%;
      background-color: #b3c1cd;
      .logo{
        width: 180px;
        height: 60px;
        background-color: pink;
        float: left;
        background:url('../assets/logo.png') center no-repeat;
        background-size: contain;
      }
      .logout{
        width: 180px;
        height: 60px;
        float: right;
        text-align: center;
        line-height: 60px;
        span{
          font-weight: bold;
        }
        a{
          text-decoration: none;
          color: #b07a17;
          font-weight: bold;
        }
      }
      .title{
        overflow: hidden;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        font-weight: bold;
        color: #fff;
      }
    }
    .el-container{
      background-color: #eaeef1;
      .el-aside{
        height: 100%;
        background-color: rgb(84, 92, 100);

        .el-submenu{
          width: 200px;
        }
      }
    }

  }
</style>
