<template>
   <div class='categories'>
      <el-button type='success' plain @click='showAddCategories'>添加商品</el-button>

      <!-- 商品列表 -->
      <!-- tree-key: 指定每一个节点的key，只有指定了才能，嵌套解析 -->
      <!-- level-key: 指定层级 -->
      <!--  parent-key: 如果不指定，没办法缩起来 -->
      <!-- indent-size:指定缩进 -->
      <!-- child-key: 通过哪个属性去查找子节点 children -->
      <el-table :data='categoriesList' style="width:100%" v-loading='loading'>
         <el-table-tree-column
         label='商品名称'
         prop='cat_name'
         tree-key='cat_id'
         level-key='cat_level'
         parent-key='cat_pid'
         child-key='children'></el-table-tree-column>
         <el-table-column label='是否有效' prop='cat_deleted'>
            <template slot-scope="scope">
               {{scope.row.cat_deleted}}
            </template>
         </el-table-column>
         <el-table-column label='排序' prop='cat_level'></el-table-column>
         <el-table-column label='操作' >
           <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delCategory(scope.row)"></el-button>
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

    <!-- 添加商品模态框 -->
     <!-- 添加角色模态框 -->
      <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="35%">
      <!-- 表单 -->
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" class="demo-ruleForm" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类父级" prop="cat_pid">
           <el-cascader :options="options" change-on-select :props="props" clearable v-model="addForm.cat_pid"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addCategory'>确 定</el-button>
      </span>
    </el-dialog>
   </div>
</template>

<script>
// 引入el-table-tree-column第三方插件
var ElTreeGrid = require('element-tree-grid')
// Vue.component('el-table-tree-column',ElTreeGrid);
export default {
  data () {
    return {
      categoriesList: [],
      current: 1,
      pageSize: 5,
      total: 0,
      loading: true,
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      addDialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入商品的名称', trigger: 'blur' }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'

      }
    }
  },
  methods: {
    async getCategoriesList() {
      // 发送ajax请求获取商品列表
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let {meta: {status}, data: {result, total}} = res.data
      if (status === 200) {
        this.categoriesList = result
        this.total = total
        // console.log(this.categoriesList)
        // 数据回来loading清除
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoriesList()
    },
    // 修改了当前页
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoriesList()
    },
    // 添加商品分类
    async showAddCategories() {
      this.addDialogVisible = true
      // 发送ajax请求商品分类数据
      let res = await this.axios.get('categories?type=2')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.options = data
        // console.log(data)
      }
    },

    // 添加商品分类提交
    addCategory() {
      // 校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        // let {cat_name, cat_pid} = this.addForm
        let res = await this.axios.post('categories', {
          cat_name: this.addForm.cat_name,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1],
          cat_level: this.addForm.cat_pid.length
        })

        let {meta: {status}} = res.data
        if (status === 201) {
          this.$message.success('添加商品分类成功')
          // 关闭模态框
          this.addDialogVisible = false
          // 清空表单
          this.$refs.addForm.resetFields()
          // 重新渲染
          this.getCategoriesList()
        }
      })
    },
    // 点击删除商品分类
    async delCategory(row) {
      console.log(row)
      await this.$confirm('你确定要删除此项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 发送ajax请求
      let res = await this.axios.delete(`categories/${row.cat_id}`)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        this.getCategoriesList()
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style lang="less" scoped>
</style>
