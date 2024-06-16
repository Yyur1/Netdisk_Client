import Vue from 'vue'
import VueRouter from 'vue-router'
import vuexIndex from '@/store/index.js'


const Index = () => import('views/index.vue')
const Files = () => import('views/files/Files.vue')
const Albums = () => import('views/albums/Albums.vue')
const Collectes = () => import('views/collectes/Collectes.vue')
const Login = () => import('views/login/Login.vue')
const Role_Control = () =>import('views/role_control/index.vue')

const Resetpwd = ()=>import('views/resetpwd/index.vue')
const groupsource = () =>import('views/group/index.vue')
const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/index',
    component: Index,
    name: '首页',
    redirect: '/files/%2Froot',
    children: [
      { name:"首页",path: '/files', redirect: '/files/%2Froot' },
      { path: '/files/:path', name: 'files', component: Files },
      { name:"文件",path: '/albums', component: Albums },
      { name:"收藏夹",path: '/collectes', component: Collectes },
      {name:"角色管理", path:'/role_control',component: Role_Control},
      {path:'/groupsource',component: groupsource}
    ]
  },
  { path: '/login', component: Login },
  { path: '/resetpwd', component: Resetpwd},
]

Vue.use(VueRouter)



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//
// router.beforeEach((to, from, next) => {
//   if (to.path !== '/login'&& !vuexIndex.state.userInfo) {
//     router.replace('/login')
//   }
//   next()
// })

export default router
