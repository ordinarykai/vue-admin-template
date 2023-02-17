<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="工单号">
          <el-input v-model="listQuery.correlateId" placeholder="请输入工单号" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="状态">
          <!-- 0:待处理，1：处理完成,-1：处理失败 -->
          <el-select v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="处理完成" :value="1" />
            <el-option label="待处理" :value="0" />
            <el-option label="处理失败" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="listQuery.date"  value-format="yyyy-MM-dd 00:00:00" type="daterange" range-separator="至" start-placeholder="开始日期"
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

      <el-table-column prop="cspId" label="上级节点" align="center"></el-table-column>
      <el-table-column prop="lspId" label="下级节点" align="center"></el-table-column>
      <el-table-column prop="correlateId" label="工单号" align="center"></el-table-column>
      <el-table-column prop="cmdFileUrl" label="工单地址" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column prop="level" label="优先级" :formatter="levelFormat" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

      <el-table-column  fixed="right" align="center" width="150" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" v-if="row.status == 0" size="mini" @click="handelUpdateLevel(row)">
            更改优先级
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
      @pagination="getList" />

    <!-- 更改优先级弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="优先级" prop="status">
          <el-select v-model="temp.level" placeholder="请选择优先级">
            <el-option label="高" :value="2" />
            <el-option label="中" :value="1" />
            <el-option label="低" :value="0" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateLevel()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { page, updateLevel } from '@/api/workOrder'
import Pagination from '@/components/Pagination'

export default {
  name: 'Channel',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        channelName: undefined
      },
      temp: {
        id: undefined,
        channelCode: undefined,
        channelName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        detail: '详情'
      },
      categoryTypeList: ['央视','卫视','特色','本地','高清'],
      readonly: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
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
    handelUpdateLevel (row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row)
      this.temp.categoryType = row.categoryType != null ? row.categoryType.split(',') : []
      this.dialogStatus = 'detail'
      this.readonly = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateLevel(){
      let data =  this.temp
      updateLevel(data).then(response => {
        this.dialogFormVisible = false
        this.getList()
      })
    },
    updateEnable(row) {
      updateEnable({ 'id': row.id })
    },
    updateSchedule(row) {
      updateSchedule({ 'id': row.id })
    },
    updateTimeShift(row) {
      updateTimeShift({ 'id': row.id })
    },
    levelFormat(row, column) {
      if (row.level <= 0) {
        return '低'
      } else if (row.level == 1){
        return '中'
      } else {
        return '高'
      }
    },
    statusFormat(row, column) {
      if (row.status == 0) {
        return '待处理'
      } else if (row.status == 1) {
        return '处理完成'
      } else if (row.status == -1) {
        return '处理失败'
      } else {
        return '其它'
      }
    }
  }
}
</script>
