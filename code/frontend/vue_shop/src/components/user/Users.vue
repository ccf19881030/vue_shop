<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="delOpen(scope.row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航
      @size-change：对应pagesize改变
      @current-change：对应pagenum改变
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 主体内容 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <!-- 主体内容 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="名称" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="30%" @close="setRoleDialogClosed">
      <div>
        <p>当前用户：{{usersInfo.username}}</p>
        <p>当前角色：{{usersInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (!regEmail.test(value)) {
        callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入合法的电话'))
      }
      callback()
    }
    return {
      // 用户列表数据
      userList: [],
      // 获取查询用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户总数量
      total: 0,
      // 是否显示添加用户弹窗
      addDialogVisible: false,
      // 添加用户对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      // 是否弹出修改用户弹框
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },

      // 控制分配角色对话框显示或隐藏
      setRoleVisible: false,
      // 点击分配角色获取对应用户的信息
      usersInfo: {},
      // 角色列表
      roleList: [],
      // 角色下来框默认id
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 查询用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // pagesize改变，从新请求
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // pagenum 改变，重新请求
    handleCurrentChange (current) {
      this.queryInfo.pagenum = current
      this.getUserList()
    },
    // 修改用户状态，当用户点击状态切换按钮时，状态值会变更，这时保存到后台数据库
    async userStateChanged (row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      // 如果更新出错
      if (res.meta.status !== 200) {
        // 修改前端页面中的用户状态
        row.mg_state = !row.mg_state
        return this.$message.error('用户状态更新失败！')
      }
      this.$message.success('用户状态更新成功')
    },
    // 添加用户弹框
    addDialog () {
      // 首先设置addDialogVisible为true，显示弹窗
      this.addDialogVisible = true
    },
    // 关闭添加用户弹框后，重置所有字段
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定时添加用户弹框
    addUser() {
      // 首先获取添加用户输入框对象，获取验证是否通过
      this.$refs.addFormRef.validate(async valide => {
        if(!valide) {
          this.$message.error('请填写完整用户信息')
        }
        // 发送请求完成添加用户的操作
        const { data: res } = await this.$http.post('users', this.addForm)
        if(res.meta.status !== 201) {
          console.log(res)
          return this.$message.error(res.meta.msg)
        }
        // 添加成功的提示
        this.$message.success('添加用户成功')
        // 关闭对话框
        this.addDialogVisible = false
        // 重新请求最新的数据
        this.getUserList()
      })
    },
    // 根据用户id查询用户信息，用作修改弹框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 查询成功，将用户数据保存到editForm 中
      this.editForm = res.data
      // 显示弹框
      this.editDialogVisible = true
    },
    // 关闭修改用户弹窗时，清空表单字段
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    eidtUser() {
      // 首先验证表单合法
      this.$refs.editFormRef.validate(async valide => {
        if(!valide) {
          this.$message.error('请填写完整用户信息')
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 关闭弹框
        this.editDialogVisible = false
        // 重新请求最新数据
        this.getUserList()
      })
    },
    async delOpen(id) {
      // 确认时，接收的confirmResult为confirm ,取消时 confirmResult为cancel
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 点击取消删除
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 确认删除
      const { data: res } = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      // 重新请求最新数据
      this.getUserList()
    },
    // 设置角色
    async setRole(usersInfo) {
      // 获取用户信息
      this.usersInfo = usersInfo
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      this.setRoleVisible = true
    },
    // 点击确定保存新选择的角色
    async saveRoleInfo() {
      // 判断是否选择了新的角色
      if(!this.selectRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }

      // 保存数据到数据库
      const { data: res } = await this.$http.put(`users/${this.usersInfo.id}/role`, { rid: this.selectRoleId })
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('分配角色成功')
      // 重新查询用户列表数据
      this.getUserList()
      // 关闭对话框
      this.setRoleVisible = false
    },
    // 关闭分配权限对话框触发
    setRoleDialogClosed() {
      // 重置下拉框的内容
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
