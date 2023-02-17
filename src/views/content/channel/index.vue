<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="频道名称">
          <el-input v-model="listQuery.channelName" placeholder="请输入频道名称" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search"
          @click="handleFilter">
          搜索
        </el-button>
      </el-form>
    </div>

    <!-- table列表 -->
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">

      <el-table-column prop="channelCode" label="频道Code" align="center"></el-table-column>
      <el-table-column prop="channelNumber" label="频道号" align="center"></el-table-column>
      <el-table-column prop="channelName" label="频道名称" align="center"></el-table-column>
      <el-table-column prop="multiCastUrl" label="组播地址" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="playUrl" label="单播地址" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="categoryType" label="分类" align="center"></el-table-column>

      <el-table-column prop="isEnable" label="上线/下线" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" :active-value="1" :inactive-value="0"
            @change="updateEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isSchedule" label="启用/关闭节目单" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isSchedule" :active-value="1" :inactive-value="0"
            @change="updateSchedule(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isTimeShift" label="启用/关闭时移" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isTimeShift" :active-value="1" :inactive-value="0"
            @change="updateTimeShift(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isPaid" label="是否收费" :formatter="isPaidFormat" align="center"></el-table-column>
      <el-table-column prop="isStaticState" label="是否静态化" :formatter="isStaticStateFormat"
        align="center"></el-table-column>

      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

      <el-table-column fixed="right" align="center" width="150" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="jumpScheduleList(row)">
            详情
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
      @pagination="getList" />

    <!-- 编辑/详情弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="频道Code" prop="channelCode">
          <el-input v-model="temp.channelCode" :readonly="readonly" placeholder="请输入频道Code" />
        </el-form-item>

        <el-form-item label="频道名称" prop="channelName">
          <el-input v-model="temp.channelName" :readonly="readonly" placeholder="请输入频道名称" />
        </el-form-item>

        <el-form-item label="频道号" prop="channelNumber">
          <el-input v-model="temp.channelNumber" :readonly="readonly" placeholder="请输入频道号" />
        </el-form-item>

        <el-form-item label="是否收费" prop="isPaid">
          <el-select v-model="temp.isPaid" :disabled="readonly" placeholder="请选择是否收费">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="组播地址" prop="multiCastUrl">
          <el-input v-model="temp.multiCastUrl" :readonly="readonly" placeholder="请输入组播地址" />
        </el-form-item>

        <el-form-item label="单播地址" prop="playUrl">
          <el-input v-model="temp.playUrl" :readonly="readonly" placeholder="请输入单播地址" />
        </el-form-item>

        <el-form-item label="频道分类" prop="categoryType">
          <el-checkbox-group v-model="temp.categoryType" :disabled="readonly">
            <el-checkbox v-for="(item, index) in categoryTypeList " :key="item" :label="item">
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'update' ? updateData() : dialogFormVisible = false">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { page, update, updateEnable, updateSchedule, updateTimeShift } from '@/api/channel'
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
      categoryTypeList: ['央视', '卫视', '特色', '本地', '高清'],
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
      console.log(this.listQuery)
      page(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.categoryType = row.categoryType != null ? row.categoryType.split(',') : []
      this.dialogStatus = 'update'
      this.readonly = false
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
    updateData() {
      let data = this.temp
      data.categoryType = this.temp.categoryType.join(",")
      update(data).then(response => {
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
    isPaidFormat(row, column) {
      if (row.isPaid == 1) {
        return '是'
      } else {
        return '否'
      }
    },
    isStaticStateFormat(row, column) {
      if (row.isStaticState == 1) {
        return '是'
      } else {
        return '否'
      }
    },
    jumpScheduleList(row) {
      const now = new Date();
      this.$router.push({
        name: "节目单管理", query: {
          channelName: row.channelName,
          startDate: now.getFullYear() + 
            ((now.getMonth() + 1 < 10) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) +
            ((now.getDate() < 10) ? '0' + now.getDate() : now.getDate()) 
        }
      })
    }
  }
}
</script>
