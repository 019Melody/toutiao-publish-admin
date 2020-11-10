<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--/面包屑-->
      </div>
      <!--数据表格筛选-->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
      <el-radio-group v-model="status">
        <!--
          el-radio 默认把 label 作为文本和选中之后的 value 值
         -->
        <el-radio :label="null">全部</el-radio>
        <el-radio :label="0">草稿</el-radio>
        <el-radio :label="1">待审核</el-radio>
        <el-radio :label="2">审核通过</el-radio>
        <el-radio :label="3">审核失败</el-radio>
        <el-radio :label="4">已删除</el-radio>
      </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
      <el-select v-model="channelId" placeholder="请选择频道">
        <el-option
          label="全部"
          :value="null"
        ></el-option>
        <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
      </el-select>
        </el-form-item>
        <el-form-item label="日期">
      <el-date-picker
        v-model="rangeDate"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
        </el-form-item>
        <el-form-item>
      <el-button :disabled="loading" type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <!--/数据表格筛选-->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
               根据数据筛选条件共查询到{{totalCount}}条结果
      </div>
      <!--数据列表-->
      <!--table 表格组件
        1、把需要展示的数组列表数据绑定给 table 组件的 data 属性
                      注意：不用去 v-for 遍历，它自己会遍历
        2、设置表格列 el-table-column
           width 可以设定表格列的宽度
           label 可以设定列的标题
           prop 用来设定要渲染的列表项数据字段，只能展示文本
      -->
    <el-table
      :data="articles"
      stripe
      class="list-table"
      size="mini"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="封面"
        width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.cover.images[0]"
            fit="cover"
            lazy
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <!-- <img
            v-if="scope.row.cover.images[0]"
            class="article-cover"
            :src="scope.row.cover.images[0]" alt=""
          >
          <img v-else class="article-cover" src="./no-cover.gif" alt=""> -->
          <!--
            下面这种情况是在运行期间动态改变处理的。
            而本地图片必须在打包的时候就存在。
           -->
          <!-- <img
            class="article-cover"
            :src="scope.row.cover.images[0] || './no-cover.gif'" alt=""
          > -->
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态">
        <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
        <template slot-scope="scope">
          <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <!--如果需要自定义表格列模板，则把需要自动以的内容放到 template 里面-->
         <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"
              size="mini"></el-button>
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              @click="onDeleteArticle(scope.row.id)"
              type="danger"></el-button>
      </template>
      </el-table-column>
    </el-table>
<!--/数据列表-->
<!--列表分页-->
<el-pagination
    layout="prev, pager, next"
    background
    :disabled="loading"
    :page-size="pageSize"
    :current-page.sync="page"
    @current-change="onCurrentChange"
    :total="totalCount" />
<!--/列表分页-->
    </el-card>
</div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      totalCount: 0,
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中 loading
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    this.loadArticles(1)
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      // 展示加载中 loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中 loading
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      console.log(articleId)
      console.log(articleId.toString())
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log('onDeleteArticle')
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 60px;
  background-size: cover;
}
</style>
