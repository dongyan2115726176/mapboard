<template>
    <div
        class="chart-widget"
    >
        <div
            :class="[`chart-init${index}`,'chart-dom']"
            :ref="`chart-init${index}`"
        >
        </div>
    </div>
</template>
<script>
import echarts from "echarts"
import Bus from '../../../../utils/eventBus';
import ChartDataUtil from "../../../../utils/chartDataUtil";
import CommonUtil from "../../../../utils/commonUtil";
export default {
    data () {
        return {
            echartsNode: null
        }
    },
    props: {
        param: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    computed: {
        style () {
            return this.param.style;
        },
        option () {
            return this.param.option;
        }
    },
    created () {
        /* 在 ChartSetting组件中 $emit定义 实现实时更新对应的图表
         * option 更改后的图表option
         * index 为当前统计图 的下标值 与 container 组件中 对应的图表下标一直
         */
        Bus.$on("upadte-graph",(option ,index)=>{
            if (this.echartsNode && this.index === index) {
                this.echartsNode.setOption(option,true);
            }
        })
        Bus.$on("dbSetting-left-moudles",(theme)=>{
            this.changeChartTheme(theme)
        })
        // 接收大屏的主题样式 来设置颜色系列
        Bus.$on("theme-change",(themePlan,isInit)=>{
            if(isInit){ return;}
            let {chart} = themePlan;
            this.option.title.textStyle.color = chart.title;
            this.param.defaultColor = chart;
            let option = ChartDataUtil.gradientColor(this.option,chart,this.param.chartType);
            this.initChart(option);
        })
    },
    watch: {
        option (newVal) {
            this.initChart(newVal);
        },
        style:{
            handler(){
                setTimeout(()=>{
                    this.echartsNode.resize();
                },200)
            },
            deep:true
        }
    },
    destroyed(){
        clearInterval(this.saveInterval);
    },
    mounted () {
        this.initChart(this.option);
    },
    methods: {
        // 更改主题颜色样式
        changeChartTheme(theme){
            let option = ChartDataUtil.changeRadarChartThemeColor(this.param.option,theme);
            this.initChart(option);
        },
        // 初始化统计图表
        initChart (option) {
            if(!this.echartsNode){
                let name = `chart-init${this.index}`;
                this.echartsNode = echarts.init(this.$refs[name]);
                this.echartsNode.setOption(option,true);
            }
            this.echartsNode.setOption(option);
            setTimeout(()=>{
                this.echartsNode.resize();
            },200)
        },
        // 缩放组件大小改变
        onResize(left, top, width, height){
            this.param.style = CommonUtil.onResize(left, top, width, height);
        },
        // 组件位置变化
        onDragging(left, top){
            this.param.style.top = top + "px";
            this.param.style.left = left + "px";
        },
        // 缩放组件获焦
        onActivated(){
            this.heightLight = false;
            Bus.$emit("toggle-settingPanel",this.param);
        },
        // 缩放组件失焦
        onDeactivated(){

        }
    }
}
</script>

<style scoped>
    .chart-widget {
        width: 100%;
        height: 100%;
    }
    .chart-dom {
        width: 100%;
        height: 100%;
    }
</style>
