<template>
    <div id="module-chart">
        <div>
            <p class="f16">{{$t("commonChart")}}：</p>
        </div>
        <i class="split-line"></i>
        <ul>
            <li
                v-for="(item,index) in chartsUnit"
                :key="index"
                @click="selectChart(index)"
                @dragstart="selectChart(index,true)"
                class="chart-item"
                :draggable="true"
            >
                <div class="chart-list-img">
                    <img :src="item.img" alt="">
                </div>
                <span class="chart-text">{{item.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import Bus from "../../../utils/eventBus"
import ChartDataUtil from "../../../utils/chartDataUtil"
//黑色主题图片
import bBar from "../../../assets/images/bBar.png"
import bXbar from "../../../assets/images/bXbar.png"
import bLine from "../../../assets/images/bLine.png"
// import bPie from "../../../assets/images/bPie.png"
import bAnnular from "../../../assets/images/bAnnular.png"
import bRadar from "../../../assets/images/bRadar.png"
export default {
    name: "Chart",
    data () {
        return {
            chartsUnit:[
                {name:this.$t("bar"),img:bBar,type:"bar"},
                {name:this.$t("xbar"),img:bXbar,type:"xbar"},
                {name:this.$t("line"),img:bLine,type:"line"},
                //{name:this.$t("pie"),img:bPie,type:"pie"},
                {name:this.$t("annular"),img:bAnnular,type:"annular"},
                {name:this.$t("radar"),img:bRadar,type:"radar"}
            ],
            count : 0,  //临时计数，用于偏移相同组件的位置
            chartColor:{
                title:"#ffffff",
                body:["#243BCC","#2C61FF","#499BFF","#15D1F2","#67A9FF"]
            }
        }
    },
    created(){
        // 接收大屏的主题样式 来设置颜色系列
        Bus.$on("theme-change",(themePlan)=>{
            let {chart} = themePlan;
            this.chartColor = chart;
        })
    },
    methods:{
        // 获得图表对应的文件名称
        getfielName(chartType){
            let name = "Bar";
            if(chartType === "bar" || chartType === "xbar" || chartType === "line"){
                name = "Bar";
            }else if(chartType === "annular"){
                name = "Pie";
            }else if(chartType === "radar"){
                name = "Radar"
            }
            return name;
        },
        // 选择图标类型
        selectChart (index,isDrag) {
            let chartType = this.chartsUnit[index].type;
            let fileName = this.getfielName(chartType);
            let chartParam = {
                type: fileName,
                icon:`md-icon-${chartType}`,
                nls:chartType,
                chartType,
	            title: this.$t("demonstrationChart"),
                id: new Date().getTime(),
                style: {
                    top: "300px",
                    left: "400px",
                    width: "300px",
                    height: "250px"
                },
                chartParam: {
                    sortType: "unsort",
                    showDataNum: this.$t('allData'),
                    xAxisField: null,
                    maxField:null,
                    YAxisField: [],
                    id: "chartDemo",
                    url: "../../../utils/chart_demo.json",
                    dataName: this.$t("demonstrationData"),
                    frequency:5,
                    smooth:false,
                    agent:true,
                    legendPosition:"bottom",
                    autoPlay:false // 饼图自动播放
                },
                defaultColor: this.chartColor,
                option:null
            };
            if (!window.chartData["chartDemo"]) {
                let demoData = require('../../../utils/chart_demo.json');
                ChartDataUtil._assembleDataCallback(demoData, demoData[0], this.$t("demonstrationData"),chartParam,false,isDrag);
            }else {
                let defaultData =  window.chartData["chartDemo"];
                ChartDataUtil.diffTypeChart(defaultData,chartParam,isDrag);
            }
        }
    }
}
</script>

<style scoped>
    #module-chart {
        padding-right: 20px;
        padding-top: 19px;
    }
    #module-chart > ul {
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .chart-item {
        width: 100px;
        height: 100px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 15px;
    }
    .chart-item > span {
        display: block;
        margin-top: 10px;
    }
    .chart-list-img {
        width: 96px;
        height: 70px;
    }
    .chart-text {
        font-family: MicrosoftYaHei;
        font-size: 13px;
        color : #BDC9D4;
    }
    .chart-list-img > img:hover{
        border: 1px solid #13A2FC;
    }
</style>

