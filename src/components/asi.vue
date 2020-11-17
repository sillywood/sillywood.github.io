<template>
<!-- 侧边导航栏 -->
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
                            <span>我的首页</span>
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
                            <span>简历管理</span>
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
        
    
</template>
<script>
    export default {
        name:'asi',
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
         }
    }
</script>
<style>
    a{
        text-decoration-line: none;
        color:#303133 ;
    }
</style>
