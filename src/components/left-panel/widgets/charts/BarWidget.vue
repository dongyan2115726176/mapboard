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
            echartsNode: null,
            saveInterval:null, // 保存API计时器
            fieldName:"xAxis" // 区分bar和Xbar要操作的字段
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
                }else if(type === "dataNum"){
                    this.changeDataNum();
                }else if(type === "urlChange"){
                    this.stopApiChart();
                }
            }
        })
        let {chartType} = this.param;
        if(chartType === "xbar"){
            this.fieldName = "yAxis";
        }
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
        let {chartParam:{YAxisField,id}} = this.param
        if(id === "api" && YAxisField.length > 0){
            this.initApiChart();
        }
    },
    methods: {
        // 更改API数据源 停止
        stopApiChart(){
            clearInterval(this.saveInterval);
            this.initChart(this.option);
        },
        // 更改列表数量
        changeDataNum(){
            let {option,chartParam:{showDataNum,YAxisField}} = this.param;
            let num = showDataNum;
            if(showDataNum === "全部" || showDataNum === "All"){
                num = 50;
            }
            if(option.series[0].data.length > num){
                for(let i=0;i<YAxisField.length;i++){
                    option.series[i].data = option.series[i].data.slice(0,num);
                }
                option[this.fieldName].data = option[this.fieldName].data.slice(0,num);
                this.initChart(option);
                this.initTime(option);
            }
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
            let {option,option:{series},chartParam:{smooth,YAxisField}} = this.param;
            option[this.fieldName].data = [];
            let seriesObj = {
                data:[],
                barMaxWidth: '50',
                emphasis:series[0].emphasis,
                type:series[0].type,
                name:"",
                smooth:smooth
            };
            option.series = [];
            option.legend.data = [];
            for(let i=0;i<YAxisField.length;i++){
                let fieldArr = YAxisField[i].split("/");
                let fieldLen = fieldArr.length;
                let name = fieldArr[fieldLen - 1];
                seriesObj = JSON.parse(JSON.stringify(seriesObj));
                seriesObj.name = name;
                option.legend.data[i] = name;
                option.series.push(seriesObj);
            }
            option = JSON.parse(JSON.stringify(option));
            option = ChartDataUtil.gradientColor(option,this.param.defaultColor,this.param.chartType);
            clearInterval(this.saveInterval);
            this.echartsNode.setOption(option,true);
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
                this.createdApiBar(dataContent);
            });
        },
        // 处理API bar 和line型
        createdApiBar(dataContent){
            let {option,chartParam:{YAxisField,xAxisField,showDataNum}} = this.param;
            let time = this.getApiXField(xAxisField);
            option[this.fieldName].data.push(time);
            let len = YAxisField.length;
            // series 多选
            for(let i=0;i<len;i++){
                let fieldArr = YAxisField[i].split("/");
                let fieldLen = fieldArr.length;
                let content = dataContent;
                for(let j=0;j<fieldLen;j++){
                    content = content[fieldArr[j]];
                }
                option.series[i].data.push(content);
            }
            let num = showDataNum;
            if(showDataNum === "全部" || showDataNum === "All"){
                num = 50;
            }
            if(option[this.fieldName].data.length > num){
                for(let i=0;i<len;i++){
                    option.series[i].data.shift();
                }
                option[this.fieldName].data.shift();
            }
            option = JSON.parse(JSON.stringify(option));
            option = ChartDataUtil.gradientColor(option,this.param.defaultColor,this.param.chartType);
            this.param.option = option;
            this.initChart(option);
        },
        // 获取API Xfield字段
        getApiXField(xAxisField){
            return CommonUtil.getDateTime("chart",xAxisField);
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
