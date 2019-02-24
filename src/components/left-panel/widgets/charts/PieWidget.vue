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
export default {
    data () {
        return {
            echartsNode: null,
            saveInterval:null, // 保存API计时器
            saveAutoLight:null // 保存自动高亮
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
        },
        autoPlay(){
            return this.param.chartParam.autoPlay;
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
            this.option.color = chart.body;
            this.option.title.textStyle.color = chart.title;
            this.param.defaultColor = chart;
            let option = JSON.parse(JSON.stringify(this.option));
            option = ChartDataUtil.gradientColor(option,chart,this.param.chartType);
            this.param.option = option;
            this.initChart(option);
        })
        Bus.$on("change-api-chart",(id,type)=>{
            if(id === this.param.id){
                if(type === "field"){
                    this.initApiChart();
                }else if(type === "time"){
                    this.initTime();
                }else if(type === "urlChange"){
                    this.stopApiChart();
                }
            }
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
        },
        autoPlay(val){
            this.clearHeightLight();
            if(val){
                this.chartHeighLight();
            }
        }
    },
    destroyed(){
        clearInterval(this.saveInterval);
        clearInterval(this.saveAutoLight);
    },
    mounted () {
        this.initChart(this.option);
        let {chartParam:{YAxisField,id,autoPlay}} = this.param
        if(id === "api" && YAxisField.length > 0){
            this.initTime();
        }
        if(autoPlay){
            this.chartHeighLight();
        }
    },
    methods: {
        // 清除高亮
        clearHeightLight(){
            clearInterval(this.saveAutoLight);
            let len = this.param.option.legend.data.length;
            for(let i=0;i<len;i++){
                this.echartsNode.dispatchAction({
                    type:'downplay',
                    seriesIndex:0,
                    dataIndex:i
                })
            }
        },
        // 环形图高亮
        chartHeighLight(){
            let i = -1;
            this.saveAutoLight = setInterval(()=>{
                this.echartsNode.dispatchAction({
                    type:'downplay',
                    seriesIndex:0,
                    dataIndex:i
                })
                i++;
                if(i >= this.param.option.legend.data.length){
                    i=0;
                }
                this.echartsNode.dispatchAction({
                    type:'highlight',
                    seriesIndex:0,
                    dataIndex:i
                })
            },2000)
        },
        // 更改API数据源 停止
        stopApiChart(){
            clearInterval(this.saveInterval);
            this.initChart(this.option);
        },
        // 初始化时间参数
        initTime(){
            let {chartParam} = this.param;
            clearInterval(this.saveInterval);
            let time = chartParam.frequency * 1000;
            this.saveInterval = setInterval(()=>{
                this.getHttpApiData();
            },time);
        },
        // 初始化API数据的chart
        initApiChart(){
            clearInterval(this.saveInterval);
            this.getHttpApiData();
            this.initTime();
        },
        // 请求获取API数据
        getHttpApiData(){
            let crossUrl = this.param.chartParam.url;
            let {agent} = this.param.chartParam;
            let href = window.location.href;
            if(agent && href.indexOf("/apps/mapdashboard") > -1){
                crossUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
                crossUrl = crossUrl + "/apps/viewer/getUrlResource.json?url=" + encodeURIComponent(this.param.chartParam.url);
            }
            this.$http.get(crossUrl).then((res)=>{
                let dataContent = res.data
                if(typeof(dataContent) === "string"){
                    dataContent = JSON.parse(dataContent);
                }      
                this.createdApiPie(dataContent);
            });
        },
        // 处理饼状图
        createdApiPie(dataContent){
            let {option,chartParam:{YAxisField}} = this.param;
            let len = YAxisField.length;
            // series 多选
            option.series[0].data = [];
            option.legend.data = [];
            for(let i=0;i<len;i++){
                let fieldArr = YAxisField[i].split("/");
                let fieldLen = fieldArr.length;
                let content = dataContent;
                for(let j=0;j<fieldLen;j++){
                    content = content[fieldArr[j]];
                }
                option.legend.data.push(fieldArr[fieldLen - 1]);
                option.series[0].data.push({
                    name:fieldArr[fieldLen - 1],
                    value:content
                });
            }
            option = JSON.parse(JSON.stringify(this.option));
            option = ChartDataUtil.gradientColor(option,this.param.defaultColor,this.param.chartType);
            this.param.option = option;
            this.initChart(option);
        },
        // 更改主题颜色样式
        changeChartTheme(theme){
            let option = ChartDataUtil.changeChartThemeColor(this.param.option,theme);
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
