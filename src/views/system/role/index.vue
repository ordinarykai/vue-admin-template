<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="width: 200px;" class="filter-item"
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

      <el-table-column prop="roleId" label="编号" align="center"></el-table-column>
      <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            @change="updateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
        style="width: 450px; margin-left:50px;">

        <el-form-item label="角色名称">
          <el-input v-model="temp.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="菜单权限">
          <el-tree class="tree-border" :data="permissonList" show-checkbox ref="permission" node-key="permissionId"
            empty-text="加载中，请稍候" :default-checked-keys="defaultCheckedPermissonIds"
            :default-expanded-keys="defaultCheckedPermissonIds" :props="defaultProps"></el-tree>
        </el-form-item>

        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio
              v-for="status in dict_status"
              :key="status.value"
              :label="status.value"
            >{{status.label}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
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


  </div>
</template>

<script>
import { page, update, create, deleteData, updateStatus } from '@/api/role'
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
      },{
        value: 0,
        label: '禁用'
      }]
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
      getTree({ roleId: row.roleId }).then(response => {
        this.permissonList = response.data
        this.defaultCheckedPermissonIds = this.getDefaultCheckedPermissonIds(this.permissonList)
        this.dialogFormVisible = true
      })
    },
    getDefaultCheckedPermissonIds(permissons) {
      if (permissons == null || permissons == undefined) {
        return []
      }
      permissons = permissons.filter(permisson => permisson.checkArr == 1)
      let defaultCheckedPermissonIds = []
      permissons.forEach(permisson => {
        if (permisson.children == null || permisson.children == undefined || permisson.children.length == 0) {
          defaultCheckedPermissonIds.push(permisson.permissionId)
        } else {
          defaultCheckedPermissonIds = defaultCheckedPermissonIds.concat(this.getDefaultCheckedPermissonIds(permisson.children))
        }
      })
      return defaultCheckedPermissonIds
    },
    updateData() {
      const data = this.temp
      let checkedKeys = this.$refs.permission.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.permission.getHalfCheckedKeys();
      data.permissionIds = checkedKeys.concat(halfCheckedKeys).join()
      update(data).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.defaultCheckedPermissonIds = []
        this.getList()
      })
    },
    handleCreate() {
      this.temp = {}
      this.dialogTitle = '新增'
      getTree().then(response => {
        this.permissonList = response.data
        this.defaultCheckedPermissonIds = []
        this.dialogFormVisible = true
      });
    },
    createData() {
      const data = this.temp
      let checkedKeys = this.$refs.permission.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.permission.getHalfCheckedKeys();
      data.permissionIds = checkedKeys.concat(halfCheckedKeys).join()
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
      deleteData({ roleId: row.roleId }).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.getList()
      })
    },
    updateStatus(row) {
      updateStatus({ 'roleId': row.roleId })
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
