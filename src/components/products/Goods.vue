<template>
  <div class="goods">
    <!-- 添加商品按钮 -->
    <el-button type='success' plain @click="$router.push('/goods-add')">添加商品s</el-button>

    <!-- 商品列表 -->
    <el-table :data='goodsList' style="width:100%">
      <el-table-column label='#' type='index' width='60' :index='indexMethod'></el-table-column>
      <el-table-column prop='goods_name' label='商品名称' width='200'></el-table-column>
      <el-table-column prop='goods_price' label='商品价格' width='200'></el-table-column>
      <el-table-column prop='goods_weight' label='商品重量' width='200'></el-table-column>
      <el-table-column label='创建时间' width='200'>
        <template slot-scope='scope'>
          {{scope.row.add_time |  dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label='操作' width='200'>
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" ></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" ></el-button>
          </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10,20,30,40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      current: 1,
      pageSize: 10,
      total: 0,
      goodsList: []
    }
  },
  methods: {
    async getGoodsList() {
    // 发送ajax
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      console.log(res.data)
      let {meta: {status}, data: {goods, total}} = res.data
      if (status === 200) {
        this.total = total
        this.goodsList = goods
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getGoodsList()
    },
    // 修改了当前页
    handleCurrentChange(val) {
      this.current = val
      this.getGoodsList()
    },
    // 修改索引编号
    indexMethod(index) {
      return (this.current - 1) * this.pageSize + index + 1
    }
  },
  created() {
  // 页面初始化渲染
    this.getGoodsList()
  }
}

</script>

<style lang='less' scoped>
</style>
