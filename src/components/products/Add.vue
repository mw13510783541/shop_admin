<template>
  <div class="add">
    <el-steps :active="active" finish-status="success">
      <el-step title="已完成" description='基本信息'></el-step>
      <el-step title="进行中" description='商品图片'></el-step>
      <el-step title="步骤 3" description='商品内容'></el-step>
    </el-steps>
    <el-tabs :tab-position="tabPosition" style="height: 500px;" @tab-click='change'
    v-model="activeName">
      <el-tab-pane label="基本信息" name='info'>
        <!-- 表单 -->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
             <el-cascader
              v-model="form.goods_cat"
              :options="options"
              :props='props'
              ></el-cascader>
          </el-form-item>
           <el-form-item label="是否促销">
             <el-radio v-model="form.is_promote" :label="true">备选项</el-radio>
             <el-radio v-model="form.is_promote" :label="false">备选项</el-radio>
          </el-form-item>
          <el-form-item >
            <el-button type='primary' @click='next(1,"pic")'>下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name='pic'>
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :headers='headers'
          :on-success='handerSuccess'
          :on-remove='handerRemove'>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
         </el-upload>
         <el-button type='primary' @click='next(2,"content")'>下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name='content'>
        <quill-editor v-model="form.goods_introduce"
          ref="myQuillEditor"
          >
        </quill-editor>
        <el-button type='primary' @click='addGoods'>确定</el-button>
      </el-tab-pane>
      
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabPosition: 'left',
      options: [],
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        goods_introduce: '',
        is_promote: false,
        // pic存储临时文件路径
        pics: []
      },
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'pic',
      // 设置请求头部
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change(tab) {
      console.log(tab)
      this.active = +tab.index
    },
    next(active,activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 图片上传成功的钩子函数
    handerSuccess(response, file, fileList) {
      // console.log(response)
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 删除图片
    handerRemove(file) {
      const tmpPath = file.response.data.tmp_path
      // console.log(tmpPath)
      let idx = this.form.pics.findIndex(item => item.pic === tmpPath)
      this.form.pics.splice(idx, 1)
    },
    // 添加商品提交数据
    async addGoods() {
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      console.log(res.data)
      let {meta: {status}} = res.data
      if (status === 201) {
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      }
    }
  },
  async created() {
    // 获取商品分类数据
    let res = await this.axios.get('categories?type=3')
    // console.log(res.data)
    let {meta: {status}, data} = res.data
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
  .quill-editor{
  background-color: #fff;
  // height: 300px;
  /deep/ .ql-editor{
    height: 300px;
  }
  }
</style>
