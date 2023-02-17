<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="90px">
        <el-form-item label="频道名称">
          <el-input v-model="listQuery.channelName" placeholder="请输入频道名称" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="节目名称">
          <el-input v-model="listQuery.programName" placeholder="请输入节目名称" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="节目单日期">
          <el-date-picker v-model="listQuery.startDate" value-format="yyyyMMdd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search"
          @click="handleFilter">
          搜索
        </el-button>
      </el-form>
    </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleCreate()" style="margin-bottom: 10px;">
          新增
        </el-button>
      </el-col>
    </el-row>

    <!-- table列表 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">

      <el-table-column prop="channelCode" label="频道code" align="center"></el-table-column>
      <el-table-column prop="channelName" label="频道名称" align="center"></el-table-column>
      <el-table-column prop="programCode" label="节目code" align="center"></el-table-column>
      <el-table-column prop="programName" label="节目名称" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column prop="contentType" label="节目类型" :formatter="contentTypeFormat" align="center"></el-table-column>
      <el-table-column prop="startDate" label="节目开播日期" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="节目开播时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="duration" label="节目时长" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column prop="isStaticState" label="是否静态化" :formatter="isStaticStateFormat"
        align="center"></el-table-column>

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
      @pagination="getList" />

    <!-- 新增/编辑弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px"
        style="width: 450px; margin-left:50px;">

        <el-form-item label="节目名称">
          <el-input v-model="temp.programName" placeholder="请输入节目名称" />
        </el-form-item>

        <el-form-item label="节目code">
          <el-input v-model="temp.programCode" placeholder="请输入节目code" />
        </el-form-item>

        <el-form-item label="节目时长">
          <el-input v-model="temp.duration" placeholder="请输入节目时长" />
        </el-form-item>

        <el-form-item label="节目开播日期">
          <el-date-picker v-model="temp.startDate" value-format="yyyyMMdd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="节目开播时间">
          <el-time-picker v-model="temp.startTime" value-format="HHmmss" placeholder="选择时间">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="节目类型" prop="contentType">
          <el-select v-model="temp.contentType" placeholder="请选择节目类型">
            <el-option label="点播" :value="1" />
            <el-option label="节目单" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属频道">
          <el-select v-model="temp.channelId" placeholder="请选择所属频道">
            <el-option v-for="item in channelOptions" :key="item.id" :label="item.channelName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="textMap[dialogStatus] === '编辑' ? updateData() : createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { page, create, update, deleteData } from '@/api/schedule'
import { list } from '@/api/channel'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'

export default {
  name: 'Channel',
  components: { Pagination, Message },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        channelName: undefined,
        startDate: undefined
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
        create: '新增'
      },
      categoryTypeList: ['央视', '卫视', '特色', '本地', '高清'],
      readonly: true,
      channelOptions: []
    }
  },
  created() {
    this.listQuery.channelName = this.$route.query.channelName
    this.listQuery.startDate = this.$route.query.startDate
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
    handelUpdateLevel(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      list().then(response => {
        this.channelOptions = response.data
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleCreate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'create'
      list().then(response => {
        this.channelOptions = response.data
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDelete(row) {
      deleteData({ id: row.id }).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.getList()
      })
    },
    updateData() {
      const data = this.temp
      update(data).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    createData() {
      const data = this.temp
      create(data).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    updateLevel() {
      let data = this.temp
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
    contentTypeFormat(row, column) {
      if (row.contentType == 1) {
        return '点播'
      } else if (row.contentType == 3) {
        return '节目单'
      } else {
        return '未知类型'
      }
    },
    isStaticStateFormat(row, column) {
      if (row.isStaticState == 0) {
        return '未静态化'
      } else if (row.status == 1) {
        return '已静态化'
      } else {
        return '未知状态'
      }
    }
  }
}
</script>
