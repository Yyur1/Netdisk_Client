<template>
  <div>

    <el-card>
      <el-button type="primary" @click="open" style="margin-bottom: 30px" round>创建用户组</el-button>
      <!--    <el-button type="primary" @click="getRoles" style="margin-bottom: 30px" round>创建用户组</el-button>-->
      <el-button type="primary" @click="open_for_tip" style="float: right;margin-right: 30px" round>点击打开提示</el-button>


      <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
        <el-table-column prop="key" label="群名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.key }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">invite</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">dissolve</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>

</template>
<script>

import {postHeader} from "../../network/request";

const defaultRole = {
  key: '',
}
const uuid = 'test1'
export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      // visible: false,
      // tableData1: [{
      //   id: 1,
      //   date: '2016-05-02',
      //   name: 'guest',
      //   address: ''
      // }, {
      //   id: 2,
      //   date: '2016-05-04',
      //   name: 'guest',
      //   address: ''
      // }, {
      //   id: 3,
      //   date: '2016-05-01',
      //   name: 'admin',
      //   address: '',
      //   hasChildren: true
      // }, {
      //   id: 4,
      //   date: '2016-05-03',
      //   name: 'guest',
      //   address: ''
      // }]
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getRoles()
  },
  methods: {
    getRoles() {
      let registerdata = {
        method: 'getowngroup',
        body: {
          uuid: "test1"
        }
      }
      postHeader(registerdata, true).then(
          res => {
            this.rolesList.forEach()
            // this.roleslist=res.roleslist

            console.log(res)
          }

      ).catch( err=>{
        console.log("hello")}
      )
      // const res = await getRoles(username)
      // this.rolesList = res.data
    },
    // async confirmRole() {
    //   console.log(123)
    //   this.rolesList.push(this.role)
    // },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: 'guest',
            address: ''
          }, {
            id: 32,
            date: '2016-05-01',
            name: 'guest',
            address: ''
          }
        ])
      }, 1000)
    },
    open_for_tip() {
      this.$alert('点击创建用户组并输入要创建的用户组昵称，确认后即可在下方显示用户组用户昵称及可进行的操作，点击invite按钮可以进行邀请新群成员，点击delete可以删除群组。', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
    },
    pushgroup(){
      let giveyou = {
        method: 'creategroup',
        body: {
          user_id: "test1",
          group_name:this.role.key
        }
      }
      postHeader(giveyou, true).then(
          res => {
            this.$notify.info({
              title: '提示',
              message: res.tips+'!',
              duration: 0,
              offset: 100,
            })
          }

      ).catch( err=>{
        console.log("hello")}
      )
    },
    open() {
      this.$prompt('请输入新群组名称', '创建新群组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        this.role.key=value;
        this.$message({
          type: 'success',
          message: '你要创建的群组是: ' + value
        });
        let role = Object.assign({}, defaultRole)
        role.key = this.role.key
        this.rolesList.push(role)
        this.pushgroup()

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }


  },
}
</script>
<style>

</style>
