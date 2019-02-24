<template>
    <div id="chart-setting">
        <!-- 数据来源 -->
        <div class="custom-select">
            <p class="f14">{{$t("dataSource")}}：</p>
            <el-select
                class="list-size"
                v-model="dataSource"
				@change="getGraphData"
            >
                <el-option
                    v-for="(item,index) in noApiDataList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <!-- 图标标题 -->
        <div class="custom-select">
            <span class="f14">{{$t("chartTitle")}}：</span>
            <el-input
                class="list-size"
                v-model="chartInitParam.title.text"
                @input="updateOption"
            >
            </el-input>
        </div>
        <span class="x-setting-line"></span>
        <!-- Iportal-data文件类型显示DOM -->
        <div class="chart-data-wrap">
            <!-- X轴数据 -->
            <div class="custom-select">
                <span class="f14">{{$t("xAxis")}}：</span>
                <el-select
                    class="list-size"
                    v-model="chartInitParam.chartParam.xAxisField"
                    @change="changeIndicatorForRadar"
                >
                    <el-option
                        v-for="(item,index) in xAxisFieldOption"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <span class="x-setting-line"></span>
            <!-- 数据峰值 -->
            <div class="custom-select">
                <span class="f14">{{$t("maxDataNume")}}：</span>
                <el-select
                    class="list-size"
                    v-model="chartInitParam.chartParam.maxField"
                    @change="changeIndicatorForRadar"
                >
                    <el-option
                        v-for="(item,index) in YAxisFieldOption"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <span class="x-setting-line"></span>
            <!-- Y轴数据 -->
            <div class="custom-select">
                <span class="f14">{{$t("yAxis")}}：</span>
                <el-select
                    class="list-size"
                    :multiple="true"
                    collapse-tags
                    v-model="chartInitParam.chartParam.YAxisField"
                    @change="changeSeriesForRadar"
                >
                    <el-option
                        v-for="(item,index) in YAxisFieldOption"
                        :key="index"
                        :label="item"
                        :value="item"
                        :title="item"
                        class="chart-setting-select"
                    >
                    </el-option>
                </el-select>
            </div>
            <span class="x-setting-line"></span>
            <!-- 图表颜色 -->
            <div class="custom-select">
                <span class="f14">{{$t("chartsColor")}}：</span>
                <el-select
                    class="list-size"
                    v-model="chartColor"
                    @change="changeColor"
                >
                    <el-option
                        v-for="(item,index) in chartColorOption"
                        :key="index"
                        :label="item.title"
                        :value="item.chart">
                        <div class="select-image-wrap">
                            <img :src="item.image" alt="">
                        </div>
                    </el-option>
                </el-select>
                <canvas class="canvas-color-img" ref="colorImg" width="166" height="21" style="pointer-events: none;"/>
            </div>
        </div>
        <!-- 图例位置 -->
        <div class="custom-select">
            <span class="f14">{{$t("legendPosition")}}：</span>
            <el-select
                class="list-size"
                v-model="chartInitParam.chartParam.legendPosition"
                @change="changeLegend"
            >
                <el-option
                    v-for="item in legendType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <span class="x-setting-line"></span>
        <!-- 组件尺寸 -->
        <div class="custom-select">
            <p class="f14">{{$t("componentSize")}}：</p>
        </div>
        <div class="custom-select">
            <div>
                <span class="f14">{{$t("width")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="chartInitParam.width"
                    @input="configChartWidget"
                    type="text"
                />
            </div>
            <div>
                <span class="f14">{{$t("height")}}：</span>
                <el-input
                    class="mini-input"
                    type="text"
                    @input="configChartWidget"
                    v-model="chartInitParam.height"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Bus from "../../../../utils/eventBus";
import ChartDataUtil from "../../../../utils/chartDataUtil";
import ThemStyle from "../../../../utils/themeStyle"
import CommonUtil from "../../../../utils/commonUtil";
export default {
    name: "ChartSetting",
    data () {
        return {
            xAxisFieldOption: [], // X轴字段选项
            YAxisFieldOption:[], // Y轴字段选项
            featuresData:null,
            dataId: null,// 当前统计图数据ID
            legendType: [
                {label:this.$t("top"),value:"bottom"},
                {label:this.$t("bottom"),value:"top"},
                {label:this.$t("closeLegend"),value:"close"}
            ],
            sortClass: [
                {label: this.$t("ascending"), type:"ascending"},
                {label: this.$t("descending"), type:"descending"},
                {label: this.$t("unsort"), type:"unsort"},
            ],
            chartColorOption:[], // 色带选择
            dataSource: null,
            chartColor: "",
            chartColorImg: "",
            dataNumOption:[5,10,20,this.$t('allData')], // 选择显示数据条数列表
            apiYFieldOption:[], // API数据的所有备选字段
            apiXfieldOption:[ // API数据的X轴字段
                {label:this.$t("second"),value:"second"},
                {label:this.$t("minute"),value:"minute"},
                // {label:"小时",value:"hour"},
                {label:this.$t("date"),value:"date"}
            ],
            noApiDataList:[] // 不包含API数据的dataList
        }
    },
    props:{
        param: {
            type: Object,
            required: true
        },
        dataList:{
            type: Array,
            required: true
        }
    },
    created(){
        this.getStaticData();
        Bus.$on("chartData-chartSetting",(option,chartIndex)=>{
            let {index} = this.chartInitParam;
            if(index == chartIndex){
                Bus.$emit("upadte-graph",option,index);
            }
        });
        this.chartColorOption = ThemStyle.map((item)=>{
            let obj = {
                image: item.image,
                title: item.title,
                chart: item.themeStyle.chart
            }
            return obj;
        })
    },
    computed: {
        chartInitParam () {
            let {style:{width,height},option,option:{title,legend,series,color},chartParam,chartParam:{id,dataName},nls}=this.param;
            this.param.title = title.text;
            let index = this.param.id;
            width = parseInt(width);
            height = parseInt(height);
            let data = window.chartData[id];
            if(!data){
                // TODO 当已保存过 此处初始化会失败
                if(!(chartParam.url.indexOf("../"))){
                    let demoData = CommonUtil.getDemoChartJson(chartParam.url);
                    ChartDataUtil._assembleDataCallback(demoData, demoData[0],title.text,this.param,true);
                    data = window.chartData[id];
                }
            }
            if(id !== "api"){
                let {features,xAxisFieldList,yAxisFieldList} = data;
                // 避免配置统计图时 重复为当前统计图所用数据赋值
                if (!this.dataId || this.dataId !==id) {
                    this.featuresData = features;
                    this.xAxisFieldOption = xAxisFieldList;
                    this.YAxisFieldOption = yAxisFieldList;
                    this.dataId = id;
                }
            }
            this.dataSource = dataName;
            this.initiColor(color);
            return {width,height,option,title,legend,series,index,nls,chartParam};
        }
    },
    watch: {
        chartColorImg (){
            let ctx = this.$refs.colorImg.getContext('2d');
            let colorImg = new Image(166,21);
            colorImg.src = this.chartColorImg;
            colorImg.onload = ()=>{
                ctx.drawImage(colorImg,10,0,166,21,0,0,166,21);
            }
        }
    },
    methods: {
        // 返回没有API的数据列表
        getStaticData(){
            this.noApiDataList = [];
            this.dataList.map((item)=>{
                if(item.dataSource === "data"){
                 this.noApiDataList.push(item);
                }
            })
        },
        // 选择数据触发
        getGraphData (val) {
            let dataUrl = val;
            let dataContent = this.getDataObj(val)
            let chartId = dataContent.dataId;
            let curChartParam = JSON.parse(JSON.stringify(this.param));
            curChartParam.chartParam = {
                dataSource:"data",
                id: chartId,
                url: dataUrl,
                dataName: this.dataSource,
                sortType: "unsort",
                showDataNum: this.$t('allData'),
                xAxisField: null,
                YAxisField: [],
                maxField: null,
                frequency: 5,
                legendPosition: "bottom"
            }
            ChartDataUtil.getData(curChartParam);
        },
        // 根据data url 获取信息
        getDataObj(dataUrl){
            for(let i=0;i<this.dataList.length;i++){
                if(this.dataList[i].value === dataUrl){
                    return this.dataList[i];
                }
            }
        },
        // 修改组件尺寸
        configChartWidget () {
            let param = this.param;
            let {width,height} = this.chartInitParam;
            param.style.width = (width||0)+"px";
            param.style.height = (height||0)+"px";
            return param;
        },
        // 初始化色带
        initiColor (color) {
            this.chartColorOption.forEach((item,index)=>{
                let itemColor = item.chart.body;
                if (color[0] === itemColor[0]) {
                    this.chartColor = item.title;
                    this.chartColorImg = item.image;
                    this.param.defaultColor = item.chart;
                }
            });
        },
        // 修改统计图色带
        changeColor (chartParam) {
            let {option} = this.chartInitParam;
            option.color = chartParam.body;
            this.param.defaultColor = chartParam;
            this.updateOption();
        },
        /**
         * 图例控制方法，可以控制是否显示，显示在上方还是下方
         * @param val 显示与否，以及具体位置
         */
        changeLegend (val) {
            let {option:{legend,grid}} = this.chartInitParam;
            legend.show = true;
            delete legend.top;
            delete legend.bottom;
            delete grid.top;
            switch (val){
	            case "bottom":
                    legend.bottom = 15;
                    grid.bottom = 70;
	                break;
	            case "top":
                    legend.top = 15;
                    grid.bottom = 25;
	                break;
                default :
                    grid.top = 35;
                    grid.bottom = 25;
	                legend.show = false;
	                break;
            }
            this.updateOption();
        },
        // 更改X轴和数据峰值
        changeIndicatorForRadar () {
            let{chartParam:{xAxisField,maxField}} = this.param;
            let indicator = ChartDataUtil.createdRadarIndicator(this.featuresData,xAxisField,maxField);
            this.param.option.radar.indicator = indicator;
            this.updateOption();
        },
        // 更改Y轴数据
        changeSeriesForRadar(){
            let{chartParam:{YAxisField}} = this.param;
            let seriesData = ChartDataUtil.createdRadarSeriesData(this.featuresData,YAxisField);
            let legendData = ChartDataUtil.updateLegend(YAxisField);
            this.param.option.series[0].data = seriesData;
            this.param.option.legend.data = legendData;
            this.updateOption();
        },
        // 根据修改 更新图表
        updateOption () {
            let {option,index} = this.chartInitParam;
            Bus.$emit("upadte-graph",option,index);
        }
    }

}
</script>

<style scoped>
    #chart-setting {
        padding: 0 20px;
    }
    .custom-select {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .custom-select > .list-size {
        width: 163px;
        height: 28px;
    }
    .list-size-mini {
        width: 110px;
        height: 28px;
    }
    .custom-select > .f14 {
        line-height: 28px;
    }
    .chart-size>input {
        width: 80px;
    }
    .mini-input {
        width: 64px;
        height: 28px;
    }
    .select-image-wrap {
        overflow: hidden;
        pointer-events: all;
    }   
    .select-image-wrap > img {
        pointer-events: none;
        width: 166px;
        height: 21px;
        position: relative;
        top: 3px;
        left: -10px;
    }
	.canvas-color-img {
		position: absolute;
		z-index: 100;
		left: 106px;
        padding-top: 3px;
	}
</style>
<style>
    #chart-setting .el-select__tags > span > .el-tag {
        float: left;
        max-width: 80px;
        overflow: hidden;
        vertical-align: middle;
    }
    .chart-setting-select {
        width: 180px;
    }
    .chart-setting-select > span {
        display: inline-block;
        width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: keep-all;
    }
</style>

