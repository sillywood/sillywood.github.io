<template >
<div class="datechoice">
    <div class="datechoose">
        <el-date-picker
            v-model="startime"
            type="date"
            placeholder="选择开始日期"
            >
        </el-date-picker>
    </div>

    <span>-</span>

    <div class="datechoose">
        <el-date-picker
            v-model="endtime"
            type="date"
            placeholder="选择结束日期">
        </el-date-picker>
    </div>
</div>
</template>

<style>
    .datechoice{
        overflow: hidden;
        width: 270px;
        float: left;
    }

    .datechoose{
        overflow: hidden;
        width: 120px;
        float: left;
        margin: 0 5px;
        border: 1px solid white;
        border-radius: 4px;
    }
    
    .datechoice span{
        float: left;
        line-height:40px ;
    }
</style>


<script>
export default {
    name:'datechoice',
    props: ["timea","timeb"],
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        startime:"",
        endtime:"",
        
      }
    },
    
    mounted () {
        setTimeout(() => {
            // console.log("收到的日期数据为：")
            // console.log(this.timea);
            // console.log(this.timeb);
            this.startime=this.timea;
            this.endtime=this.timeb;
        }, 500);
        
    }
}

</script>
