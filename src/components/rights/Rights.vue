<template>
<div class="rights">
   <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">管理权限</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table :data="rightList" style="width: 100%">
      <el-table-column label='#' type='index' width='60'></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="300"></el-table-column>
      <el-table-column prop="path" label="路径" width="300"></el-table-column>
      <el-table-column label="层级" width="300">
       <!-- 自定义列表层级 -->
       <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
       </template>
      </el-table-column>
    </el-table>
</div>
</template>
<script>
export default {
  data() {
    return {
      rightList: []
    }
  },

  async created () {
    // 获取所有权限列表
    let res = await this.axios.get(`rights/list`)
    console.log(res)
    let {meta: {status}, data} = res.data
    if (status === 200) {
      this.rightList = data
    }
  }
}
</script>

<style lang='less' scoped>

</style>
