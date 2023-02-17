<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="listQuery.name" placeholder="请输入菜单名称" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="菜单标识">
          <el-input v-model="listQuery.value" placeholder="请输入菜单标识" style="width: 200px;" class="filter-item"
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
        <!-- <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="createData">新增</el-button> -->
        <el-button type="primary" @click="handleCreate()" style="margin-bottom: 10px;">
          新增
        </el-button>
      </el-col>
    </el-row>

    <!-- table列表 -->
    <el-table v-loading="listLoading" :data="list" style="width: 100%;" row-key="permissionId" border default-expand-all
      :tree-props="{ children: 'children' }">

      <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
      <el-table-column prop="value" label="菜单标识" align="center"></el-table-column>
      <el-table-column prop="num" label="序号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleCreate(row)">
            新增
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 新增/编辑弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px"
        style="width: 450px; margin-left:50px;">

        <el-form-item label="上级菜单" prop="parentId">
          <treeselect v-model="temp.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
            placeholder="选择上级菜单" />
        </el-form-item>

        <el-form-item label="菜单名称">
          <el-input v-model="temp.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单标识">
          <el-input v-model="temp.value" placeholder="请输入菜单标识" />
        </el-form-item>

        <el-form-item label="序号">
          <el-input-number v-model="temp.num" :min="0" controls-position="right" />
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


  </div>
</template>

<script>
import { list, update, create, deleteData, getTree } from '@/api/permission'
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
      menuOptions: []
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
      list(this.listQuery).then(response => {
        this.list = this.arrayToTree(response.data)
        console.log(this.list)
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
      this.getTreeselect();
      this.dialogFormVisible = true
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.permissionId,
        label: node.name,
        children: node.children
      }
    },
    getTreeselect() {
      getTree().then(response => {
        this.menuOptions = []
        const menu = { permissionId: 0, name: '主类目', children: [] }
        menu.children = this.arrayToTree(response.data)
        this.menuOptions.push(menu)
        console.log(this.menuOptions)
      });
    },
    updateData() {
      const data = this.temp
      data.type = 1
      update(data).then(response => {
        Message({
          message: res.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    handleCreate(row) {
      this.temp = {}
      this.temp.num = 0
      if (row == null || row == undefined) {
        this.temp.parentId = 0
      } else {
        this.temp.parentId = row.permissionId
      }
      this.dialogTitle = '新增'
      this.getTreeselect();
      this.dialogFormVisible = true
    },
    createData() {
      const data = this.temp
      data.type = 1
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
      deleteData({ permissionId: row.permissionId }).then(response => {
        Message({
          message: response.message,
          type: 'success'
        })
        this.getList()
      })
    }
  }
}
</script>
