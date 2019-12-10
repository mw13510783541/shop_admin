<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
    </el-input>
    <el-button type="success" plain @click='showAddDialog'>添加用户</el-button>
     <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="35%">
      <!-- 表单 -->
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="60px" class="demo-ruleForm" status-icon>
        <el-form-item label="用户" prop="username">
        <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click='addUser'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="35%">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="60px" class="demo-ruleForm" status-icon>
        <el-form-item label="用户" prop="username">
           <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click='editUser'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户表格 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width='200'>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
        v-model="scope.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change='changeState(scope.row)'>
         </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" plain size='small' @click='showEditDialog(scope.row)'></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size='small' @click='delUser(scope.row)'></el-button>
         <el-button type="success" icon="el-icon-check" plain size='small'>分配角色</el-button>
      </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
      :page-size='pageSize'
      :page-sizes="[2, 4, 6, 8]"
      :current-page="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
     </el-pagination>

  </div>
</template>

<script>

export default {
  data() {
    return {
      query: '',
      current: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      editDialogVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入邮箱地址', trigger: 'change' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 渲染当前页
    renderCurrent() {
      this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
        // // 设置请求头，获取token
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        let {meta, data} = res.data
        if (meta.status === 200) {
        // console.log(res.data)
          this.userList = data.users
          this.total = data.total
        }
      })
    },
    // 修改当前页
    handleCurrentChange(val) {
      // console.log(val)
      this.current = val
      this.renderCurrent()
    },
    // 修改梅每页显条数
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.current = 1
      this.renderCurrent()
    },
    // 搜索功能
    search() {
      this.renderCurrent()
    },
    // 改变状态
    changeState(row) {
      // console.log(row)
      this.axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      }).then(res => {
        // console.log(res.data)
        let {meta} = res.data
        // console.log(meta,data)
        if (meta.status === 200) {
          this.$message.success('修改状态成功')
        } else {
          this.$message.error('修改状态失败')
        }
      })
    },
    // 删除用户
    delUser(row) {
      this.$confirm('亲，你确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          url: `users/${row.id}`,
          method: 'delete'
        }).then(res => {
          this.$message.success('删除用户成功')
          if (this.userList.length === 1 && this.current > 1) {
            // 当页面只剩一条数据时，删除后要页面跳转到前一页去
            this.current--
          }
          // 删除成功，重新渲染页面
          this.renderCurrent()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 弹出添加用户弹框
    showAddDialog() {
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      console.log(row)
      this.editForm = row
    },
    // 表单校验
    addUser() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.axios.post('users', this.addForm).then(res => {
            let {meta} = res.data
            if (meta.status === 201) {
              this.$message.success('添加用户成功')
              // 关闭模态框
              this.dialogVisible = false
              // 清空表单
              this.$refs.addForm.resetFields()
              // 重新渲染
              this.total++
              this.current = Math.ceil(this.total / this.pageSize)
              this.renderCurrent()
            }
          })
        } else {
          this.$message.error('添加失败')
          return false
        }
      })
    },
    // 添加用户校验
    editUser() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }).then(res => {
            console.log(res.data)
            let {meta: {status}} = res.data
            if (status === 200) {
              this.$refs.editForm.resetFields()
              this.editDialogVisible = false
              this.renderCurrent()
            } else {
              this.$message.error('编辑失败')
            }
          })
        } else {
          this.$message.error('编辑失败')
        }
      })
    }
  },
  created () {
    this.renderCurrent()
  }
}
</script>

<style>
  .el-breadcrumb{
    height: 30px;
    line-height: 30px;
  }
  .input-with-select{
    width: 300px;
    margin-bottom: 5px;
  }
</style>
