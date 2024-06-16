<template>
  <div>

    <el-card>
      <el-button type="primary" @click="uploadsource" style="margin-bottom: 30px" round>上传</el-button>
<!--      <el-button type="primary" @click="open_for_tip" style="float: right;margin-right: 30px" round>点击打开提示</el-button>-->
      <el-button type="text" @click="lookforsource" style="margin-bottom: 30px" round>刷新查看群文件</el-button>
      <el-table :data="sourceList" style="width: 100%;margin-top:30px;" border>
        <el-table-column prop="key" label="群文件类型" width="250px">
          <template slot-scope="scope">
            {{ scope.row.sourcetype }}
          </template>
        </el-table-column>
        <el-table-column prop="sourcename" label="群文件名" width="400px">
          <template slot-scope="scope">

            {{ scope.row.sourcename }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations" >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="downloadsource(scope)">下载</el-button>
            <el-button type="danger" size="small" @click="deletesource(scope)">删除</el-button>
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
      sourcetype: "",
      sourceList:
          {
            sourcetype:'',
            sourcename:''
          }
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    //this.getRoles()
  },
  methods: {
   // 尝试初始化获得数据刷新
    getRoles() {
      let datas = {
        method: 'getowngroup',
        body: {
          uuid: this.uuid,
        }
      }
      postHeader(datas, true).then(
          res => {
            console.log(res),
               this.sourceList=res.data;

          }
      )
      // const res = await getRoles(username)
      // this.rolesList = res.data
    },
    // async confirmRole() {
    //   console.log(123)
    //   this.rolesList.push(this.role)
    // },

    // 上传资源
    uploadsource(){


        var member = res
        console.log(member);
        var length = member.length;
        this.sourceList.push(
            {

            })
    },
    // 下载内容
    downloadsource(){

    },
    // 删除内容
    deletesource(){

        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定的操作(调用接口)

          for (var i = 0; i < hasmembers.length; i++) {
            if (row.id == hasmembers[i].id) {
              this.zichandetail.members.splice(i, 1);
              this.$message({ message: '删除成功', duration: 2000, type: 'success' });
            }
          }
        }).catch(() => {
          //点取消的提示
          return;
        });


    },


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




  },
}
</script>
<style>

</style>
