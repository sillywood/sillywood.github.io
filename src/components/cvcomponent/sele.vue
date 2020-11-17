<template>
<!-- 性别选择 -->
<div class="seles">
    <el-select v-model="value" placeholder="性别">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name:'seles',
    props: ["sex"],
    data() {
      return {
        options: [{
          value: '选项1',
          label: '男'
        }, {
          value: '选项2',
          label: '女'
        }],
        value: ''
      }
    },
   
    mounted () {
      setTimeout(() => {
      //   console.log("sex:");
      //   console.log(this.sex);
        this.value=this.sex;  
        
      }, 500);
      
    }
  }
</script>