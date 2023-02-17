<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="操作用户">
          <el-input v-model="listQuery.username" placeholder="请输入操作用户" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="操作模块">
          <el-input v-model="listQuery.module" placeholder="请输入操作模块" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="操作名">
          <el-input v-model="listQuery.name" placeholder="请输入操作名" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="操作时间">
          <el-date-picker v-model="listQuery.date"  value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search"
          @click="handleFilter">
          搜索
        </el-button>
      </el-form>
    </div>

    <!-- table列表 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">

      <el-table-column prop="operateLogId" label="编号" align="center"></el-table-column>
      <el-table-column prop="username" label="操作用户" align="center"></el-table-column>
      <el-table-column prop="module" label="操作模块" align="center"></el-table-column>
      <el-table-column prop="name" label="操作名" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userIp" label="用户IP" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resultCode" label="操作结果" :formatter="resultCodeFormat" align="center"></el-table-column>
      <el-table-column prop="resultMsg" label="结果提示" align="center"></el-table-column>
      <el-table-column prop="startTime" label="操作时间" align="center"></el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
      @pagination="getList" />

  </div>
</template>

<script>
import { page } from '@/api/log'
import Pagination from '@/components/Pagination'

export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        username: undefined,
        module: undefined,
        name: undefined,
        date: undefined,
        startTime: undefined,
        endTime: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.date != undefined && this.listQuery.date != null) {
        this.listQuery.startTime = this.listQuery.date[0]
        this.listQuery.endTime = this.listQuery.date[1]
      } else {
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
      }
      const query = JSON.parse(JSON.stringify(this.listQuery))
      query.date = undefined
      page(query).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resultCodeFormat(row, column) {
      if (row.resultCode == 200) {
        return '成功'
      } else if (row.resultCode == 400) {
        return '失败'
      } else if (row.resultCode == 401) {
        return '未登录或登录过期'
      } else if (row.resultCode == 403) {
        return '未授权'
      } else {
        return '未知'
      }
    }
  }
}
</script>
