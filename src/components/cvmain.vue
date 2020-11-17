<template>
    <div class="cvmain">
        <el-form ref="form" :model="CV" label-width="80px">
            <div id="CV1" >
                <uphoto ref="photo"></uphoto>
                <div class="info">
                    <input v-model='CV.name' type="text" id="first" placeholder="请输入姓名"><br>
                    <input v-model='CV.disc' type="text" id="second" placeholder="请一句话简介自己"><br>
                    <seles ref="sex" v-bind:sex="CV.sex"></seles>
                    <input v-model='CV.age' type="text" placeholder="年龄" class="age">
                    <input v-model="CV.tele" type="text" placeholder="请输入联系方式" class="conta">
                </div>
            </div>
            <h3>教育背景</h3>
            <div id="CV2" v-for="(CV2,index) in CV.CV2s" v-bind:index="index" v-bind:key="index">
               <el-form-item>    
                    <span style="display:none">{{CV2.id}}</span>
                    <datechoice  ref="CV2time"  v-bind:timea="CV2.startime" v-bind:timeb="CV2.endtime" ></datechoice>
                    <input v-model="CV2.schoolname" type="text" class="yourname" 
                    placeholder="请输入学校名称" @click="getime1($event)">
                    <input v-model="CV2.major" type="text" class="major" placeholder="专业">
                    <input v-model="CV2.majorclass" type="text" class="major" style="width:80%" placeholder="主修课程">
                    <input type="button" class="additem" @click="additem1" value="+">
                    <input type="button" class="additem" @click="deletitem($event,CV.CV2s)" value="-" >
               </el-form-item>
            </div>
            <h3>项目经历</h3>

           
           <div id="CV3" v-for="(CV3,id) in CV.CV3s"  v-bind:key="id">
                <el-form-item>
                    <span style="display:none">{{CV3.id}}</span>
                    <datechoice ref="CV3time" v-bind:timea="CV3.startime" v-bind:timeb="CV3.endtime" ></datechoice>
                    <input v-model="CV3.subjectname" type="text" class="yourname"
                     placeholder="请输入项目名称"  @click="getime2($event)">
                    <el-input v-model="CV3.subject" class="subject"
                        type="textarea"
                        :autosize="{ minRows: 2}"
                        placeholder="请输入项目内容"
                        >
                    </el-input>
                    <input type="button" class="additem" @click="additem2" value="+">
                    <input type="button" class="additem" @click="deletitem($event,CV.CV3s)" value="-" >
                </el-form-item>
            </div>
            <h3>荣誉奖项</h3>
              <div id="CV4" v-for="(CV4,id) in CV.CV4s"  v-bind:key="id">
                <span style="display:none">{{CV4.id}}</span>
                <div class="datechoose">
                    <el-date-picker
                        v-model="CV4.prizedate"
                        type="month"
                        placeholder="获奖年月">
                    </el-date-picker>
                 </div>
                <input type="text" class="yourname" placeholder="奖项名称">
                <el-input class="subject"
                    type="textarea"
                    :autosize="{ minRows: 2}"
                    placeholder="请输入奖项描述"
                    v-model="CV4.prizedisc">
                </el-input>
                <input type="button" class="additem" 
                @click="additem3" value="+">
                <input type="button" class="additem" 
                @click="deletitem($event,CV.CV4s)" value="-" >
            </div>
            <h3>个人标签</h3>
            <div id="CV5">
                <el-form-item v-model="CV.CV5">
                    <div class="yourtags">
                        <el-tag
                        :key="tag"
                        v-for="tag in CV.CV5.dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="CV.CV5.inputVisible"
                        v-model="CV.CV5.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" 
                        @click="showInput">+ New Tag</el-button>
                    </div>
                </el-form-item>
            </div>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            
        </el-form>
    </div>
</template>

<script>
import uphoto from './cvcomponent/uploadphoto.vue'
import seles from './cvcomponent/sele'
import datechoice from './cvcomponent/datechoice'
const requrl='http://localhost:8000'

export default {
    name:'cvmain',
    data() {
      return {
        CV: {
          imagurl:'',
          name:'',
          disc:'',
          sex:'',
          age:'',
          tele:'',
          CV2s:[{
            id:"",
            schoolname:'',
            major:'',
            majorcclass:'',
            startime:'',
            endtime:''
          }],
          CV3s:[{
              id:"",
              startime:'',
              endtime:'',
              subjectname:'',
              sbuject:''
          }],
          CV4s:[{
              id:"",
              prizedate:'',
              prizedisc:'',
          }],
          CV5:{
              dynamicTags: ['音乐', '电影', '旅游','健身'],
              inputVisible: false,
              inputValue: ''
          }
        }
      }
        
    },
    created  (){
        this.getCV();
    },
    methods: {
        getCV(){
          this.axios({
            method:'get',
            url:requrl+"/getCV",
            params:{
                data:{
                    name:"张三"
                }
            }
         }).then(res=>{
             res=res.data;
            //  console.log('res.CV.CV2s');
            //  console.log(res.CV.CV2s);
             this.CV=res.CV;
         });
        },
        
        //勾选时返回时间
        getime1(e){
            let divname=this.CV.CV2s;
            let divnum=e.target.parentElement.firstElementChild.innerHTML;
            let thetime=this.$refs.CV2time[divnum];
            this.$options.methods.getimee(e,divname,thetime,divnum);
        },
        getime2(e){
            let divname=this.CV.CV3s;
            let divnum=e.target.parentElement.firstElementChild.innerHTML;
            let thetime=this.$refs.CV3time[divnum];
            this.$options.methods.getimee(e,divname,thetime,divnum);
        },
        getimee(e,divname,thetime,divnum){
            // console.log(thetime);
            divname[divnum].startime=thetime.startime;
            divname[divnum].endtime=thetime.endtime;
            // console.log(divname[divnum].startime);
            // console.log(divname[divnum].endtime);
            
        },
        additem1(){
            let ll=this.CV.CV2s.length*1;
            // console.log(ll+" has been add");
            this.CV.CV2s.push({
                id:ll,
                schoolname:'',
                major:'',
                majorcclass:'',
                startime:'',
                endtime:''
            });
        },
        additem2(){
            let ll=this.CV.CV3s.length*1;
            // console.log(ll+" has been add");
            this.CV.CV3s.push({
                id:ll,
                subjectname:'',
                sbuject:''
            })
        },
        additem3(){
            let ll=this.CV.CV4s.length*1;
            // console.log(ll+" has been add");
            this.CV.CV4s.push({
              id:ll,
              prizedate:'',
              prizedisc:'',
          })
        //   console.log(this.CV.CV4s);
        },
        deletitem(e,deletid){
            let deletnum=e.target.parentElement.firstElementChild.innerHTML*1;
            console.log(deletid);
            // console.log(deletnum);
            // console.log(deletnum+" has been delet");
            if(deletid.length>=2){
                
                let deletPromise=new Promise((res)=>{
                   let p= deletid.splice(deletnum,1);
                   console.log(p);
                    res("弹出结束");
                })
                deletPromise.then(()=>{
                    for(let i=deletnum;i<deletid.length;i++){
                        (i=>{
                            deletid[i].id=i*1;
                            console.log("第"+i+"个修改完毕")
                        })(i);
                    }
                })
                
            }
            
        },
        handleClose(tag) {
            this.CV.CV5.dynamicTags.splice(this.CV.CV5.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.CV.CV5.inputVisible = true;
            this.$nextTick(function() {
            this.CV.CV5.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.CV.CV5.inputValue;
            if (inputValue) {
            this.CV.CV5.dynamicTags.push(inputValue);
            }
            this.CV.CV5.inputVisible = false;
            this.CV.CV5.inputValue = '';
        },
        onSubmit() {
            // this.CV.imagurl=this.CV.$refs.photo[0].imagUrl;
            // console.log(this.CV.imagurl);
            console.log('submit!');
            this.CV.sex=this.$refs.sex.value;
            let dataa={
                "CV": {
                    "imagurl":this.CV.imagurl,
                    "name":this.CV.name,
                    "disc":this.CV.disc,
                    "age":this.CV.age,
                    "tele":this.CV.tele,
                    "CV2s":this.CV.CV2s,
                    "CV3s":this.CV.CV3s,
                    "CV4s":this.CV.CV4s,
                    "CV5":this.CV.CV5
                }
            };
            this.axios({
                method:'post',
                url:"http://localhost:8000/setCV",
                params:{
                    data:dataa
                }
            }).then(res=>{
                res=res.data;
                console.log(res);
                if(res.srarus===2000){
                    console.log("炸了");
                }
            });
            console.log(dataa);
        }
    },
    components:{
        uphoto,
        seles,
        datechoice
    }
}
</script>
<style>
    h3{
        float: left;
    }
    .cvmain{
        overflow: hidden;
        width: 80%;
        text-align: center;
        margin-left: 10%;
    }
    
    input::placeholder{
        color: #C0C4CC;
    }

    #CV1,#CV2,#CV3,#CV4,#CV5{
     position: relative; 
     overflow: hidden;  
     text-align: left;
     margin-bottom: 5%;
     padding: 2%;
     clear: both;
    }
    
    #CV1:hover,#CV2:hover,#CV3:hover,#CV4:hover,#CV5:hover{
        border: 1px solid #409EFF;
        border-radius: 4px;
    }

    .uphoto{
        float: left;
    }
    .info{
        height: 150px;
        overflow: hidden;
    }
    #first,#second{
        width: 90%;
        margin: 10px 10px;
        font-size: 24px;
        border: 1px solid white;
        border-radius: 4px;
    }
    
    #second{
        font-size: 14px;
    }
    .info .seles{
        width: 21%;
        margin-left: 10px;
        float: left;
    }
    input{
        border: 1px solid white;
        border-radius: 4px;
    }
    .info .age,.info .conta{
        width: 15%;
        height: 36px;
        float: left;
        margin-left: 4px;
        text-align: center;
    } 
    .info .conta{
        width: 50%;
        float: left;
        margin-left: 10px;
    }
    
   
     .yourname{
        height: 36px;
        float:right;
        text-align: center;
        margin-right: 4%;
    }
    #CV2 .major{
        float: left;
        clear: both;
        margin: 5px;
        height: 30px;
        text-align: center;
    }
    .subject{
        margin: 5px;
        resize: none;
    }
    .additem{
        float: right;
        height: 30px;
        width: 30px;
        margin: 5px;
        background-color: white;
    }
     .additem:hover{
         background-color:#C0C4CC ;
     }
     .el-tag + .el-tag {
    margin-left: 10px;
  }
   .yourtags span:hover{
        cursor: pointer;
        background-color: white;
   }
   .yourtags .button-new-tag span:hover{
       background-color: #ecf5ff;
   }
  .yourtags .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

