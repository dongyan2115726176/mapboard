<template>
    <div
        class="time-widget"
        :style="timeParam.fontStyle"
    >
        <span>{{time}}</span>
    </div>
</template>

<script>
import CommonUtil from '../../../../utils/commonUtil';
import Bus from '../../../../utils/eventBus'
export default {
    name: "TimeWidget",
    data(){
        return {
            time:"" ,
            timeInterval:null
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
            this.param.param.fontStyle.color = text;
        })
    },
    computed: {
        timeParam(){
            let {param:{fontStyle,timeType}} = this.param;
            this.initTime(timeType);
            return {fontStyle,timeType};
        }
    },
    destroyed(){
        clearInterval(this.timeInterval);
    },
    methods: {
        // 初始化
        initTime(timeType){
            clearInterval(this.timeInterval);
            this.time = CommonUtil.getDateTime("time",timeType);
            this.timeInterval = setInterval(()=>{
                this.time = CommonUtil.getDateTime("time",timeType);
            },1000)
        }
    }
}
</script>

<style scoped>
    .time-widget {
        display:table;
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .time-widget > span {
        display:table-cell;
        vertical-align: middle;
    }
</style>

