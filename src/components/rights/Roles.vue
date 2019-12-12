<template>
    <div class="roles">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">管理权限</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">角色列表</a></el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type='success' plain @click='showAddRoles'>添加角色</el-button>
      <!-- 表格 -->
      <el-table :data='rolesList' style="width:100%">
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <!-- 没有权限的提示 -->
            <el-row v-if="scope.row.children.length === 0">
              <span>暂无权限</span>
            </el-row>
            <!-- 一级权限 -->
           <el-row class="level1" v-for="level1 in scope.row.children" :key='level1.id'>
              <el-col :span='4'>
                <el-tag closable @close='closeRight(scope.row,level1.id)'>{{level1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span='20'>
                <el-row class="level2" v-for="level2 in level1.children" :key='level2.id'>
                  <el-col :span='4'>
                    <el-tag closable type='success' @close='closeRight(scope.row,level2.id)'>{{level2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span='20'>
                  <!-- 三级权限 -->
                  <span class="level3" v-for="level3 in level2.children" :key="level3.id"><el-tag closable type='danger' @close='closeRight(scope.row,level3.id)'>{{level3.authName}}</el-tag></span>
                </el-col>
                </el-row>
              </el-col>
           </el-row>
          </template>
        </el-table-column>
        <el-table-column label='#' type='index' width='60'></el-table-column>
        <el-table-column prop='roleName' label='角色名称' width='400'></el-table-column>
        <el-table-column prop='roleDesc' label='描述' width='400'></el-table-column>
        <el-table-column label='操作' width='400'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click='showEditRoles(scope.row)'></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" @click='delRole(scope.row)'></el-button>
            <el-button type="success" icon="el-icon-check" plain size="small" @click="showAssignRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色模态框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="35%">
      <!-- 表单 -->
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" class="demo-ruleForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
           <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addRole'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色模态框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="35%">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px" class="demo-ruleForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
           <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='editRole'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限模态框 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="35%">
      <el-tree
      :data="rightList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps">
     </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分 配</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色的名称', trigger: 'blur' }
        ]
      },
      roleId: '', // 角色id
      editDialogVisible: false,
      assignDialogVisible: false,
      rightList: [],
      // data2: [{
      //     id: 1,
      //     label: '一级 1',
      //     children: [{
      //       id: 4,
      //       label: '二级 1-1',
      //       children: [{
      //         id: 9,
      //         label: '三级 1-1-1'
      //       }, {
      //         id: 10,
      //         label: '三级 1-1-2'
      //       }]
      //     }]
      //   }, {
      //     id: 2,
      //     label: '一级 2',
      //     children: [{
      //       id: 5,
      //       label: '二级 2-1'
      //     }, {
      //       id: 6,
      //       label: '二级 2-2'
      //     }]
      //   }, {
      //     id: 3,
      //     label: '一级 3',
      //     children: [{
      //       id: 7,
      //       label: '二级 3-1'
      //     }, {
      //       id: 8,
      //       label: '二级 3-2'
      //     }]
      //   }],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 获取角色
    async getRoleList () {
      let res = await this.axios.get('roles')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rolesList = data
      // console.log(this.rolesList)
      }
    },
    // 删除角色
    async delRole(row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let {meta: {status}} = res.data
        if (status === 200) {
          this.$message.success('角色删除成功')
          this.getRoleList()
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        this.$message.error('取消失败')
      }
    },
    // 添加角色模态框
    showAddRoles() {
      this.addDialogVisible = true
    },
    // 添加角色
    async addRole() {
      let res = await this.axios.post('roles', this.addForm)
      let {meta: {status}} = res.data
      if (status === 201) {
        // 关闭模态框
        this.addDialogVisible = false
        // 清空内容
        this.$refs.addForm.resetFields()
        // 重新渲染
        this.getRoleList()
        this.$message.success('添加用户成功')
      }
    },
    // 编辑角色弹框
    showEditRoles(row) {
      this.editDialogVisible = true
      this.editForm = row
      // console.log(row)
    },
    // 编辑角色
    async editRole() {
      let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.editDialogVisible = false
        this.getRoleList()
        // 清空内容
        this.$refs.editForm.resetFields()
        this.$message.success('编辑用户成功')
      }
    },
    // 关闭角色权限
    async closeRight(row, rightId) {
      console.log(rightId)
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        // 重新渲染当前角色权限的信息
        row.children = data
      } else {
        this.$message.error('删除失败')
      }
    },
    // 分配权限
    async showAssignRights(row) {
      this.roleId = row.id
      this.assignDialogVisible = true
      let res = await this.axios.get(`rights/tree`)
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rightList = data
        let temp = []
        row.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              temp.push(level3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      }
    },
    // 发送分配请求
    async assignRight() {
      // console.log(this.roleId)
      let keys = this.$refs.tree.getCheckedKeys()
      let halfKeys = this.$refs.tree.getHalfCheckedKeys()
      // console.log(keys, halfKeys)
      let rids = keys.concat(halfKeys).join()
      // console.log(rids)
      // 发送post请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {rids})
      console.log(res)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('分配权限成功')
        this.getRoleList()
        // 关闭模态框
        this.assignDialogVisible = false
      }
    }

  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level1{
  margin-bottom: 15px;
  .level2{
    margin-bottom: 10px;
    .level3{
      margin-right: 5px;
    }
  }
}
</style>
