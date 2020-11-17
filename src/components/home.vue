<template>
    <div class="home">
        <el-row>
            <el-col :span="12">
                
                <div class="grid-content workatten" id="workcan">
                </div>
                <button  class="workattend" @click="workattendence">打卡</button>
            </el-col>
            <el-col :span="12"><div class="grid-content workatten" id="workatenchart"></div></el-col>
        </el-row>
        <el-row gutter="1">
            <el-col :span="24"><div class="grid-content performance" id="progress"></div></el-col>
            <button class="prog" @click="addprogress">添加今日进度</button>
        </el-row>
    </div>
</template>

<style>
    .home .workatten{
        height: 450px;
        overflow: hidden;
    }
    .home {
        position: relative;
    }
    .home .el-row {
        overflow: hidden;
        margin: 10px 0;
    }
    .home .el-col {
        border-radius: 4px;
        /* border: 1px solid #409EFF; */
        position: relative;
    }
    
    .home .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .home .performance{
        height: 150px;
    }
    .home .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .home .workattend{
        width: 60px;
        height: 30px;
        border: 1px solid white;
        border-radius: 4px;
        background-color: white;
        color: black;
        position:absolute;
        left:45%;
        bottom:2%;
        
    }
    .home .prog{
        /* width: 60px; */
        height: 30px;
        border: 1px solid white;
        border-radius: 4px;
        background-color: white;
    }
    .home .workattend:hover,.home .prog:hover{
        background-color: #409EFF;
        color: white;
    }
     
</style>

<script>
const echarts=require("echarts");
const requrl='http://localhost:8000'
    export default {
        name:"home",
        data () {
            return {
                workcanData:{
                    id:1,
                    workok:0
                },
                workcancharts:'',
                workatencharts:'',
                workatenchartsData:{
                    id:"",
                    startime:[],
                    endtime:[],
                    worktime:[]
                },
                progresschart:'',
                progresschartData:{
                    oldprogress:[],//累计进度数据
                    nowprogress:[]//今日进度
                }
            }
        },
        methods: {
            showchart2(){
                let workatenchart=document.getElementById("workatenchart");
                this.workatencharts=echarts.init(workatenchart);
                let workdata=new Array();
                let dayNums=new Array();//周几
                // console.log(this.workatencharts);
                this.getAttendenceData(workdata).then(res=>{
                    workdata=res;
                    console.log("原始数据:");
                    console.log(workdata);
                }).then(()=>{   //清洗数据
                    // console.log("数据清洗");
                    let today=new Date();
                    let days;
                    let day=today.getDay()*1;
                    
                    if(day==0){
                        days=6;
                    }else{
                        days=day-1;
                    }
                    let stardcs=Date.parse(today.toLocaleDateString());//封装为Date对象
                    stardcs=stardcs-days*24*3600*1000;     //本周开始的时间点
                    for(let i=0;i<workdata.length;i++){
                        (j=>{
                            // console.log(j);
                            let q=Date.parse(workdata[j].date);//打卡日期当日0时的毫秒数
                            // console.log(q);
                            // console.log(stardcs);
                            // console.log(stardcs-q);
                            if(q<stardcs){
                                let a=workdata.splice(j,1);
                                // console.log("第"+j+"个已删除,是: ");
                                // console.log(a);
                                // console.log(workdata);
                                i--;
                            }
                        })(i)
                    }
                }).then(()=>{  //数组排序
                    // console.log("数组排序")
                    // console.log(workdata);
                    let compare = function (x, y) {//比较函数
                                if (x.startime < y.startime) {
                                    return -1;
                                } else if (x.startime > y.startime) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                            // console.log(workdata);
                            workdata.sort(compare);
                            console.log(workdata);
                }).then(()=>{//时间处理
                            for(let i=0;i<workdata.length;i++){
                                (i=>{
                                    let startime=new Date(workdata[i].startime);
                                    let endtime=new Date(workdata[i].endtime);
                                    let dayNum=startime.getDay();
                                    if(dayNum==0){
                                        dayNum=7
                                    }
                                    dayNums.push(dayNum);
                                    let tempWork=workdata[i].worktime/3600/1000;
                                    let worktime=Math.floor(tempWork)+":"+Math.round((tempWork-Math.floor(tempWork))*60);
                                    workdata[i].startime="2020/1/1 "+startime.toLocaleString('chinese',{hour12:false}).slice(9,14);
                                    workdata[i].endtime="2020/1/1 "+endtime.toLocaleString('chinese',{hour12:false}).slice(9,14);
                                    workdata[i].worktime="2020/1/1 "+worktime;
                                    // console.log(worktime);
                                })(i)
                            }
                }).then(()=>{
                    dayNums.sort(function(a, b){return a - b});//排序
                    this.workatenchartsData.startime=[];
                    this.workatenchartsData.endtime=[];
                    this.workatenchartsData.worktime=[];
                    let max=new Date();
                    max=max.getDay();
                    if(max==0){
                        max=7;
                    }
                    let j=0;
                    for(let i=0;i<max;i++){
                        console.log(dayNums);
                        (i=>{
                            console.log(i);
                                console.log(j);
                            if(i==dayNums[j]-1){                                
                                this.workatenchartsData.startime.push(workdata[j].startime);
                                this.workatenchartsData.endtime.push(workdata[j].endtime);
                                this.workatenchartsData.worktime.push(workdata[j].worktime);
                                j++;
                            }else{
                                this.workatenchartsData.startime.push("2020/1/1 00:00:00");
                                this.workatenchartsData.endtime.push("2020/1/1 00:00:00");
                                this.workatenchartsData.worktime.push("2020/1/1 00:00:00");
                            }
                            
                        })(i)
                    }
                }).then(()=>{
                    // console.log(this.workatenchartsData.startime);
                    let option1={
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            },
                            formatter:function(value){
                                // console.log(value);
                                let showValue;
                                    for(let i=0;i<value.length;i++){
                                        if(i==value.length-1){
                                            value[i].value=value[i].value.slice(9,14);
                                            console.log(value[i].value);
                                        }else{
                                                (()=>{
                                                    let date=new Date(value[i].value);
                                                    date=date.toLocaleString('chinese',{hour12:false});
                                                    date=date.slice(9,14);
                                                    if(date=="24:00"){
                                                        date="00:00"
                                                    }
                                                    value[i].value=date;
                                                    // console.log(i+" "+value[i].value);
                                                })(i)
                                            }
                                        }
                                        
                                    // console.log(value);
                                    showValue="下班时间："+value[0].value+"</br>"+"上班时间："+value[1].value+"</br>"+"工作时长："+value[2].value;
                                    // console.log(showValue)
                                    return showValue;
                               
                                
                            }
                        },
                        grid:{
                            width:'80%',
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {show: true}
                            }
                        },
                        legend: {
                            data: ['上班时间', '下班时间', '工作时长']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['周一','周二','周三','周四','周五','周六','周日'],
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'time',
                                name: '时间',
                                min:"2020/1/1 00:00:00",
                                max:"2020/1/1 23:59:59",
                                axisLabel: {
                                    formatter:function(value){
                                        let date=new Date(value);
                                        date=date.toLocaleString('chinese',{hour12:false});
                                        
                                        date=date.slice(9,14);
                                        if(date=="24:00"){
                                            date="00:00"
                                        }
                                        console.log(date);
                                        return date;
                                    }
                                },
                                axisPointer:{
                                    label:{
                                        formatter:function(value){
                                            // console.log(value.value);
                                            let date=new Date(value.value);
                                            date=date.toLocaleString('chinese',{hour12:false});
                                            date=date.slice(9,14);
                                            if(date=="24:00"){
                                                date="00:00"
                                            }
                                            // console.log(date);
                                            return date;
                                        }
                                    }
                                    
                                },
                                axisTick:{
                                    show:true
                                },
                                data:["下班时间","上班时间"]
                            }
                        ],
                        series: [
                            {
                                name: '工作时长',
                                type: 'bar',
                                itemStyle:{
                                    color:'#FFDAB9'
                                },
                                data: this.workatenchartsData.worktime
                            },
                            {
                                name: '下班时间',
                                type: 'line',
                                itemStyle:{
                                    color:'#FF9224'
                                },
                                // areaStyle:{},
                                data: this.workatenchartsData.endtime
                            },
                            {
                                name: '上班时间',
                                type: 'line',
                                itemStyle:{
                                    color:'#FFD306'
                                },
                                // areaStyle:{
                                //     color:"#FFFFFF"
                                // },
                                data: this.workatenchartsData.startime
                            }
                        ]
                    };
                    this.workatencharts.setOption(option1);
                })
                
            },
            showchart1(){
                let workcan=document.getElementById("workcan");
                this.workcancharts=echarts.init(workcan);
                // console.log(this.workcancharts);
                let today=new Date();
                let year=today.getFullYear();
                
                let month=today.getMonth()+1;
                let day=today.getDate();
                let endyear,enday,endmonth;
                
                 if(month==12){
                     endyear=year+1;
                     endmonth="01";
                     enday=endyear+"-"+endmonth+"-"+"01";
                }else{
                    endyear=year;
                    endmonth=month+1;
                    
                }

                if(month<10){
                    month="0"+month;
                }
                if(day<10){
                    day="0"+day;
                }

                if(endmonth<10){
                        endmonth="0"+endmonth;
                    }

                let startday=year+"-"+month+"-"+"01";
                enday=endyear+"-"+endmonth+"-"+"01";
                let rangeday=year+"-"+month;
                // console.log(startday);
                
                function getVirtulData(startday,enday) {//获取日期
                    var date = +echarts.number.parseDate(startday);
                    // console.log(date);
                    var end = +echarts.number.parseDate(enday);
                    var dayTime = 3600 * 24 * 1000;
                    var data = [];
                    
                    for (var time = date; time < end; time += dayTime) {
                        
                        data.push([
                            echarts.format.formatTime('yyyy-MM-dd', time),
                            Math.floor(Math.random() * 10000)
                        ]);
                        // console.log("scatta: "+data);
                    }
                    return data;
                }
                function getPieSeriesUpdate(scatterData, chart) {
                    return echarts.util.map(scatterData, function (item, index) {
                        var center = chart.convertToPixel('calendar', item);
                        return {
                            id: index + 'pie',
                            center: center
                        };
                    });
                }

                let scatterData = getVirtulData(startday,enday);
                // console.log(scatterData);
                let cellSize=[70,70];
                let option2 = {
                    tooltip : {},
                    
                    calendar: {
                        top: 'middle',
                        left: 'center',
                        orient: 'vertical',
                        cellSize: cellSize,
                        yearLabel: {
                            show: false,
                            textStyle: {
                                fontSize: 22
                            }
                        },
                        dayLabel: {
                            margin: 20,
                            firstDay: 1,
                            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                        },
                        monthLabel: {
                            show: false
                        },
                        range: [rangeday]
                    },
                    series: [{
                        id: 'label',
                        type: 'scatter',
                        coordinateSystem: 'calendar',
                        symbolSize: 1,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return echarts.format.formatTime('dd', params.value[0]);
                                },
                                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                                textStyle: {
                                    color: '#000',
                                    fontSize: 14
                                }
                            }
                        },
                        data: scatterData
                    }]
                };
                var pieInitialized;
               
                this.workcancharts.setOption(option2);
                let workcancharts=this.workcancharts;
                let workdata=new Array();
                let startindex;
                this.getAttendenceData(workdata).then(res=>{
                    workdata=res;
                    // console.log(workdata);
                }).then(()=>{
                    let compare = function (x, y) {//比较函数
                                if (x.startime < y.startime) {
                                    return -1;
                                } else if (x.startime > y.startime) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                            // console.log(workdata);
                            startindex=workdata.sort(compare)[0].date.slice(7)*1;
                            // console.log(startindex);
                }).then(()=>{
                    let serries=this.getPieSeries(scatterData, workcancharts,startindex,workdata);
                    setTimeout(function () {
                        pieInitialized = true;
                        workcancharts.setOption({
                            series: serries
                        });
                    }, 10);
                })
                
                

                window.onresize = function () {
                    if (pieInitialized) {
                        workcancharts.setOption({
                            series: getPieSeriesUpdate(scatterData, workcancharts)
                        });
                    }
                };
            },
            getAttendenceData(workdata){
                    return this.axios({
                           method:'get',
                           url:requrl+"/getattendencedata",
                           params:{
                               data:{
                                   id:1
                               }
                           }
                       }).then(res=>{
                           res=res.data;
                        //    console.log("数据来啦")
                        //    console.log(res);
                           workdata=res.data;
                           return workdata;
                       })
                       
            },
            getPieSeries(scatterData, chart,startindex,workdata) {
                    let num=new Date();
                    num=num.getDate();//今天的号数
                        let i=0;
                    return echarts.util.map(scatterData, function (item, index) {
                        let color='red';
                        let value=0;
                        // console.log(index);
                        // console.log(startindex);
                        if(index<=num-1){   //只有今日及今日以前的数据
                        // console.log("index: "+index);
                            if(i<workdata.length){
                                // console.log("index: "+index);
                                // console.log("startindex: "+startindex);
                                if(index==startindex-1){
                                    let tonum=workdata[i].date.split("/")[2];
                                    // console.log("tosum"+tonum)
                                    if(index==tonum-1){
                                        value=workdata[i].worktime/1000/3600;
                                        value=Math.round(value*100)/100;
                                    
                                        let workok=workdata[i].workok;
                                        switch(workok){
                                            case 0:color="red"; break;
                                            case 1:color="orange";break;
                                            case 2:color='#409EFF';break;
                                        }
                                        i++;//数据数组下标+1
                                    }
                                    
                                    startindex++;
                                    
                                    // console.log(i);
                                }
                            }else{
                                color='red';
                            }
                        }else{
                            color='white';
                        }
                        
                        var center = chart.convertToPixel('calendar', item);
                        return {
                            id: index + 'pie',
                            type: 'pie',
                            center: center,
                            itemStyle:{
                                color:color
                            },
                            label: {
                                normal: {
                                    formatter: '{c}',
                                    position: 'inside'
                                }
                            },
                            radius: 22,
                            data: [
                                {name: '工作时长', value: value},
                                
                            ]
                            
                        };
                    });
                },
            workattendence(){
                //获取打卡的时间
                let today=new Date();//打卡精确时间
                // let year=today.getFullYear();//年
                // let month=today.getMonth()+1;//月
                // let day=today.getDate();//日
                let time=today.getTime();//打卡时间毫秒数
                let nowtime=today.toLocaleDateString();  //打卡年月日
                console.log("打卡时间：");
                console.log(nowtime);
                this.axios({
                    method:'get',
                    url:requrl+"/workattendence",
                    params:{
                        data:{
                            id:1,
                            time:time,
                            date:nowtime
                        }
                    }
                }).then(res=>{
                    res=res.data;
                    alert(res);
                }).then(()=>{
                    this.showchart1();
                    this.showchart2();
                })
            },
            showchart3(){
                let progress=document.getElementById("progress");
                this.progresschart=echarts.init(progress) ;
                let showurl=requrl+"/showprogress";
                let date=(new Date()).toLocaleDateString();
                this.axios({
                    method:'get',
                    url:showurl,
                    params:{
                        data:{
                            id:1,
                            date:date
                        }
                    }
                }).then(res=>{
                    this.progresschartData.oldprogress=[];
                    this.progresschartData.nowprogress=[];
                    res=res.data;
                    console.log(res);
                    this.progresschartData.oldprogress=res.oldprogress;
                    this.progresschartData.nowprogress=res.nowprogress;
                    // console.log(this.progresschartData.oldprogress)
                    // console.log("进度获取结束");
                }).then(()=>{
                    let nowprogress=this.progresschartData.nowprogress;
                    console.log("填充的数据是：");
                    let oldprogress=this.progresschartData.oldprogress;
                    console.log(oldprogress);
                    let option3 = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '1%',
                            top:'3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        },
                        series: [
                            {
                                name: '截至前一日累计进度',
                                type: 'bar',
                                stack: '总量',
                                itemStyle:{
                                    
                                },
                                label: {
                                    show: true,
                                    position: 'insideRight'
                                },
                                data:oldprogress
                            },
                            {
                                name: '当日进度',
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    show: true,
                                    position: 'insideRight'
                                },
                                data: nowprogress
                            }
                        ]
                    };
                    this.progresschart.setOption(option3);
                })
                
            },
            addprogress(){
                let newprogress=prompt("请输入今日工作进度","请输入今日工作进度");
                newprogress=newprogress*1;
                let longg=this.progresschartData.oldprogress.length;
                let oldprogress=this.progresschartData.oldprogress[longg-1]+newprogress;
                this.progresschartData.oldprogress.push(oldprogress);
                this.progresschartData.nowprogress.push(newprogress);
                this.progresschartData.oldprogress=this.progresschartData.oldprogress.slice(-2);
                console.log("删除后：")
                console.log(this.progresschartData.oldprogress);
                this.progresschartData.nowprogress=this.progresschartData.nowprogress.slice(-2);
                console.log(this.progresschartData.nowprogress);
                let today=new Date();
                today=today.getTime();
                this.axios({
                    method:"get",
                    url:requrl+"/saveprogress",
                    params:{
                        data:{
                            id:1,
                            nowprogress:this.progresschartData.nowprogress,
                            oldprogress:this.progresschartData.oldprogress,
                            date:today
                        }
                    }
                }).then((res)=>{
                    res=res.data
                    // res=JSON.parse(res);
                    // console.log(res.msg);
                    alert(res.msg);
                    this.showchart3();
                })
                
            }
        },
        mounted () {
            this.showchart1();
            this.showchart2();
            this.showchart3();
        }
    }
</script>