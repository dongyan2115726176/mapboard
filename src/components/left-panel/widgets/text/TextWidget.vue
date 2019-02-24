<template>
    <el-input
        :style="fontStyle"
        type="textarea"
        class="text-widget"
        v-model="param.title"
    >
    </el-input>
</template>

<script>
import Bus from '../../../../utils/eventBus'
export default {
    name: "TextWidget",
    data(){
        return {
            
        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    created(){
        // 接收大屏的主题样式 来设置颜色系列
        Bus.$on("theme-change",(themePlan,isInit)=>{
            if(isInit){ return;}
            let {text} = themePlan;
            this.param.color = text;
        })
    },
    computed: {
        fontStyle () {
            let {fontSize,lineHeight,color,fontFamily,fontWeight,textAlign,textIndent} = this.param;
            return {fontSize,lineHeight,color,fontFamily,fontWeight,textAlign,textIndent};
        }
    },
    methods: {

    }
}
</script>

<style scoped>
    .text-widget {    
        width: 100%;
        height: 100%;
    }
</style>
<style>
    .text-widget textarea {
        width: 100%;
        height: 100%;
        padding:0;
        border:none;
        background:transparent;
        text-align:inherit;
        font-size:inherit;
        font-weight:inherit;
        text-indent:inherit;
        font-family:inherit;
        line-height:inherit;
        color:inherit;
        pointer-events: none;
    }
</style>

