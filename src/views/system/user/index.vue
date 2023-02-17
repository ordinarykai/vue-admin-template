<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="用户账号">
          <el-input v-model="listQuery.username" placeholder="请输入用户账号" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
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
    <el-table v-loading="listLoading" :data="list"  border fit highlight-current-row style="width: 100%;">

      <el-table-column prop="username" label="用户账号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            @change="updateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最近登录时间" align="center"></el-table-column>
      <el-table-column prop="lastUpdateInfoTime" label="最近修改基本信息时间" align="center"></el-table-column>
      <el-table-column prop="lastUpdatePwdTime" label="最近修改密码时间" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="250">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="resetPwd(row)">
            重置
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
        style="width: 450px; margin-left:50px;">

        <el-form-item label="用户账号">
          <el-input v-model="temp.username" placeholder="请输入用户账号" />
        </el-form-item>

        <el-form-item label="用户昵称">
          <el-input v-model="temp.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="temp.roleId" placeholder="请选择角色">
            <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.name"
              :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogTitle == '新增'" label="密码">
          <el-input v-model="temp.password" placeholder="请输入密码" show-password />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogTitle === '编辑' ? updateData() : createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 重置密码弹出框 -->
    <el-dialog title="重置密码" :visible.sync="dialogResetPwdFormVisible">

      <el-form ref="dataReSetPwdForm" :model="temp" label-position="left" label-width="90px"
        style="width: 450px; margin-left:50px;">

        <el-form-item label="密码">
          <el-input v-model="resetPwdTemp.password" show-password placeholder="请输入用户的新密码" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPwdFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="resetPwdData()">
          确认
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { page, update, create, deleteData, updateStatus, resetPwd } from '@/api/admin'
import { select } from '@/api/role'
import { getTree } from '@/api/permission'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import Treeselect from "@riophae/vue-treeselect"
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'Permmsion',
  components: { Pagination, Treeselect, Message },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        value: undefined
      },
      dialogTitle: undefined,
      dialogFormVisible: false,
      dialogResetPwdFormVisible: false,
      resetPwdTemp: {
      },
      temp: {
      },
      permissonList: [],
      defaultCheckedPermissonIds: [],
      defaultProps: {
        id: 'permissionId',
        label: 'name',
        children: 'children'
      },
      dict_status: [{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }],
      roleOptions: []
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
      page(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    arrayToTree(list) {
      const result = [] // 用于存放结果
      const map = {} // 用于存放 list 下的节点

      // 1. 遍历 list，将 list 下的所有节点以 id 作为索引存入 map
      for (const item of list) {
        map[item.permissionId] = { ...item } // 浅拷贝
      }

      // 2. 再次遍历，将根节点放入最外层，子节点放入父节点
      for (const item of list) {
        // 3. 获取节点的 id 和 父 id
        const { permissionId, parentId } = item // ES6 解构赋值
        // 4. 如果是根节点，存入 result
        if (item.parentId === 0 || item.parentId === null) {
          result.push(map[permissionId])
        } else {
          if (map[parentId] == undefined) {
            result.push(map[permissionId])
          } else {
            // 5. 反之，存入到父节点
            map[parentId].children
              ? map[parentId].children.push(map[permissionId])
              : (map[parentId].children = [map[permissionId]])
          }
        }
      }
      // 将结果返回
      return result
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogTitle = '编辑'
      select().then(response => {
        this.roleOptions = response.data
        this.dialogFormVisible = true
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
    handleCreate() {
      this.temp = {}
      this.dialogTitle = '新增'
      select().then(response => {
        this.roleOptions = response.data
        this.dialogFormVisible = true
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
    handleDelete(row) {
      deleteData({ adminId: row.adminId }).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.getList()
      })
    },
    updateStatus(row) {
      updateStatus({ 'adminId': row.adminId })
    },
    resetPwd(row) {
      this.resetPwdTemp.adminId = row.adminId
      this.dialogResetPwdFormVisible = true
    },
    resetPwdData() {
      const data = this.resetPwdTemp
      resetPwd(data).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.dialogResetPwdFormVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style>
/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius: 4px;
}
</style>
