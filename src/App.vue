<template>
  <div id="app">

<el-container>
  <el-header>
    <i class="el-icon-user"></i>
    <i class="el-icon-bell"></i>
    
    <h1>支持自主上班制的HR系统</h1>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <!-- <asi></asi> -->
      <div class="asi">
        <el-row class="tac">
            <el-col :span="24">
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                    <el-submenu index="0">
                      
                        <template slot="title">
                            <i class="el-icon-s-home"></i>
                            <span><router-link to="/">我的首页</router-link></span>
                        </template>
                      
                    </el-submenu>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>日常管理</span>
                        </template>
                        <el-menu-item index="1-1">换班</el-menu-item>
                        <el-menu-item index="1-2">请假</el-menu-item>
                        <el-menu-item index="1-3">出差</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                      
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span><router-link to="/cvmain">简历管理</router-link></span>
                        </template>
                      
                        <!-- 简历锚点 -->
                        <el-menu-item index="2-1"><a href="#CV1">基本信息</a></el-menu-item>
                        <el-menu-item index="2-2"><a href="#CV2">教育背景</a></el-menu-item>
                        <el-menu-item index="2-3"><a href="#CV3">项目经历</a></el-menu-item>
                        <el-menu-item index="2-4"><a href="#CV4">荣誉奖项</a></el-menu-item>
                        <el-menu-item index="2-5"><a href="#CV5">个人标签</a></el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span>考勤管理</span>
                        </template>
                        <el-menu-item index="3-1">值班表</el-menu-item>
                        <el-menu-item index="3-2">打卡日历</el-menu-item>
                        <el-menu-item index="3-3">考勤分析</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span>绩效管理</span>
                        </template>
                        <el-menu-item index="4-1">绩效计划申请</el-menu-item>
                        <el-menu-item index="4-2">绩效审核申请</el-menu-item>
                        <el-menu-item index="4-3">工作进度</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span>薪资管理</span>
                        </template>
                        <el-menu-item index="5-1">工资条</el-menu-item>
                        <el-menu-item index="5-2">薪资走势分析</el-menu-item>
                        
                    </el-submenu>
                </el-menu>
            </el-col>
           
        </el-row>
      </div>
    </el-aside>
    <el-main>
      <router-view></router-view>
      <!-- <cvmain></cvmain> -->
      <!-- <home></home> -->
      
    </el-main>
  </el-container>
  
    <!-- <el-footer>footer</el-footer> -->
</el-container>


  </div>
</template>

<script>
// import cvmain from './components/cvmain'
// import home from './components/home'

export default {
  name: 'App',
  mounted () {
    // this.sstart();
  },
  methods: {
    handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
    handleClose(key, keyPath) {
        console.log(key, keyPath);
    }
    // sstart(){
    //   this.axios({
    //     method:"get",
    //     url:'http://localhost:8000'
    //   }).catch(function(err){
    //     console.log("联网炸啦"+err);
    //   });
    // }
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
header{
  overflow: hidden;
  /* font-size: 20px; */
}
h1{
  margin: 0;
  width: 80%;
  
}
h1:hover{
  cursor: default;;
}
header i{
  float: right;
  width: 30px;
  height: 30px;
  margin: 20px 0;
  font-size: 20px;
}
header i:hover{
  color: white;
  cursor: pointer;
}
.el-container{
  position: relative;
  direction: vertical;
  height: 100%;
  /* background-color: antiquewhite; */
}
.el-header, .el-footer {
    background-color:#409EFF;
    color: #333;
    text-align: center;
    line-height: 60px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  


  .el-aside {
    /* background-color: rgb(171, 222, 231); */
    color: #333;
    text-align: center;
    line-height: 200px;
    margin-right: 5px;
  }
  
  .asi a{
        text-decoration-line: none;
        color:#303133 ;
    }

  .el-main {
    background-color: rgb(230, 238, 243);
    color: #333;
    text-align: center;
    /* line-height: 160px; */
    height: 100%;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
