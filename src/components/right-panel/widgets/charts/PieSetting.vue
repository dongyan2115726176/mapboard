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
                    v-for="(item,index) in dataList"
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
        <div class="chart-data-wrap" v-show="!showApiData">
             <!-- X轴数据 -->
            <div class="custom-select">
                <span class="f14">{{$t("xAxis")}}：</span>
                <el-select
                    class="list-size"
                    v-model="chartInitParam.chartParam.xAxisField"
                    @change="dataForAnnular"
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
            <!-- Y轴数据 -->
            <div class="custom-select">
                <span class="f14">{{$t("yAxis")}}：</span>
                <el-select
                    class="list-size"
                    v-model="dataYAxisField"
                    @change="dataForAnnular"
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
        </div>
        <!-- API文件类型显示DOM -->
        <div class="chart-api-wrap" v-show="showApiData">
            <!-- 刷新频率 -->
            <div class="custom-select">
                <span class="f14">{{$t("autoRefresh")}}：</span>
                <div class="list-size">
                    <el-input
                        class="list-size-mini"
                        v-model="chartInitParam.chartParam.frequency"
                        @input="changeFrequency"
                    >
                    </el-input>
                    <span class="f14">{{$t("onceSecond")}}</span>
                </div>
            </div>
            <span class="x-setting-line"></span>
             <!-- API Y轴字段 -->
            <div class="custom-select">
                <span class="f14">{{$t("yAxis")}}：</span>
                <el-select
                    class="list-size"
                    :multiple="true"
                    collapse-tags
                    v-model="apiYAxisField"
                    @change="changeApiField"
                >
                    <el-option
                        v-for="(item,index) in apiYFieldOption"
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
        </div>
        <!-- 自动播放 -->
        <div class="custom-select just-left">
            <span class="f14">{{$t("autoPlay")}}：</span>
            <el-switch
                v-model="chartInitParam.chartParam.autoPlay"
                class="auto-switch"
            >
            </el-switch>
        </div>
        <!-- 图例字体大小 -->
        <div class="custom-select">
            <span class="f14">{{$t("promptText")}}：</span>
            <i 
                class="md-icon-tips f14"
                :title="$t('promptTextIcon')"
            >
            </i>
            <el-input
                class="list-size-mini"
                style="width:80px"
                v-model="chartInitParam.series[0].label.emphasis.textStyle.fontSize"
                @input="updateOption"
            >
            </el-input>
            <span class="f14">{{$t("px")}}</span>
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
        <!-- Iportal-data文件类型显示DOM -->
        <div class="chart-data-wrap" v-show="!showApiData">
             <!-- 数据展示数量标题 -->
            <div class="custom-select">
                <p class="f14">{{$t("selectDataNum")}}：<span v-show="!showApiData">({{$t("total")}}{{totalData}}{{$t("article")}})</span></p>
            </div>
            <!-- 数据展示数量 -->
            <div class="custom-select">
                <el-select
                    style="width:100%"
                    v-model="chartInitParam.chartParam.showDataNum"
                    @change="chartDataNum"
                >
                    <el-option
                        v-for="(item,index) in dataNumOption"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
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
import ThemStyle from "../../../../utils/themeStyle";
import CommonUtil from "../../../../utils/commonUtil";
export default {
    name: "ChartSetting",
    data () {
        return {
            dataYAxisField:"", // 文件型Y轴字段
            apiYAxisField:[], // api型Y轴字段
            xAxisFieldOption: [], // X轴字段选项
            YAxisFieldOption:[], // Y轴字段选项
            unsortData:null,//统计图初始化的原始数据
            interceptData:null,//统计图截取时数据
            featuresData:null,
            dataId: null,// 当前统计图数据ID
            legendType: [
                {label:this.$t("top"),value:"bottom"},
                {label:this.$t("bottom"),value:"top"},
                {label:this.$t("closeLegend"),value:"close"}
            ],
            smethods: [  //统计方式备选列表
	            {label: this.$t("count"),value: "count"}
            ],
            smethodSelected: "count",
            sortClass: [
                {label: this.$t("ascending"), type:"ascending"},
                {label: this.$t("descending"), type:"descending"},
                {label: this.$t("unsort"), type:"unsort"},
            ],
            chartColorOption:[], // 色带选择
            dataSource: null,
            xAxisMargin: 25,
            chartColor: "",
            chartColorImg: "",
            totalData:300, // 一共有多少条数据
            dataNumOption:[5,10,20,this.$t('allData')], // 选择显示数据条数列表
	        isPie: false, //用以判断是否为饼图或者环形图，这几类图不展示右侧某些数据项
            isXBAR: false, //用于判断
            isStatistics: false, //用以判断是否开启Y轴统计模式
            showApiData:false, // 显示API属相相关的选项
            apiYFieldOption:[], // API数据的所有备选字段
            apiXfieldOption:[ // API数据的X轴字段
                {label:this.$t("second"),value:"second"},
                {label:this.$t("minute"),value:"minute"},
                // {label:"小时",value:"hour"},
                {label:this.$t("date"),value:"date"}
            ] 
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
        if(this.param.chartType === "pie" || this.param.chartType === "annular"){
            this.isPie = true;
        }
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
        let {chartParam:{dataSource,url}} = this.param;
        if(dataSource === "api"){
            this.showApiData = true;
            this.getApiData(url);
        }
    },
    computed: {
        chartInitParam () {
            let {style:{width,height},option,option:{xAxis,yAxis,title,legend,series,color},chartParam,chartParam:{id,YAxisField,dataName},nls}=this.param;
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
            if(nls === "xbar"){
                //横向条形图，xy轴要对调
                this.isXBAR = true;
            }
            this.dataYAxisField = "";
            this.apiYAxisField = [];
            if(typeof(YAxisField) === "string"){
                this.dataYAxisField = YAxisField;
            }else{
                this.apiYAxisField = YAxisField;
            }
            if(id !== "api"){
                let {features,xAxisFieldList,yAxisFieldList} = data;
                // 避免配置统计图时 重复为当前统计图所用数据赋值
                if (!this.dataId || this.dataId !==id) {
                    this.unsortData = features;
                    this.interceptData = features;
                    this.featuresData = features;
                    this.totalData = features.length;
                    this.xAxisFieldOption = xAxisFieldList;
                    this.YAxisFieldOption = yAxisFieldList;
                    this.dataId = id;
                }
            }
            this.xRotateable= Boolean(xAxis.axisLabel.rotate);
            this.yRotateable= Boolean(yAxis.axisLabel.rotate);
            this.dataSource = dataName;
            this.initiColor(color);
            return {width,height,option,xAxis,yAxis,title,legend,series,index,nls,chartParam};
        },
        stateForSort () {
            if (this.chartInitParam.chartParam.YAxisField.length>1 || this.isStatistics) {
                return false
            }
            return true;
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
    mounted(){
        let {showDataNum} = this.param.chartParam;
        this.chartDataNum(showDataNum,true);
    },
    methods: {
        // 修改请求间隔时间
        changeFrequency(val){
            this.param.chartParam.frequency = parseInt(val);
            let {YAxisField,xAxisField} = this.param.chartParam;
            if(YAxisField.length > 0 && xAxisField){
                Bus.$emit("change-api-chart",this.param.id,"time");
            }
        },
        // 获取当前的API数据信息
        getApiDataContent(url){
            for(let i=0;i<this.dataList.length;i++){
                if(this.dataList[i].value === url){
                    return this.dataList[i];
                }
            }
        },
        // 获取API数据
        getApiData(url){
            let crossUrl = url;
            let {agent} = this.getApiDataContent(url);
            this.param.chartParam.agent = agent;
            let href = window.location.href;
            if(agent && href.indexOf("/apps/mapdashboard") > -1){
                crossUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
                crossUrl = crossUrl + "/apps/viewer/getUrlResource.json?url=" + encodeURIComponent(url);
            }
            this.$http.get(crossUrl).then((res)=>{
                let dataContent = res.data
                if(typeof(dataContent) === "string"){
                    dataContent = JSON.parse(dataContent);
                }
                this.apiYFieldOption = [];
                this.apiYFieldOption = this.forInOption(dataContent,this.apiYFieldOption,"");
            });
        },
        // 改变API字段
        changeApiField(val){
            let {xAxisField} = this.param.chartParam;
            let YAxisField = this.apiYAxisField;
            this.param.chartParam.YAxisField = this.apiYAxisField;
            if(YAxisField.length > 0 && xAxisField){
                Bus.$emit("change-api-chart",this.param.id,"field");
            }else{
                Bus.$emit("change-api-chart",this.param.id,"urlChange");
            }
        },
        // 转换数据结果 JSON数据转换出element-ui多层结构
        forInOption(dataContent,children,name){
            for(let i in dataContent){
                if(!(dataContent[i] instanceof Array)){
                    let layName = name+"/";
                    if(name === ""){
                        layName = "";
                    }
                    let data = layName+i;
                    if(dataContent[i] instanceof Object){
                        this.forInOption(dataContent[i],children,data);
                    }
                    if(dataContent[i]!== null && !isNaN(Number(dataContent[i]))){
                        children.unshift(data);
                    }
                }
            }
            return children;
        },
        // 选择数据触发
        getGraphData (val) {
            let dataUrl = val;
            let dataContent = this.getDataObj(val)
            let chartId = dataContent.dataId;
            let curChartParam = JSON.parse(JSON.stringify(this.param));
            let {legendPosition} = curChartParam.chartParam;
            curChartParam.chartParam = {
                dataSource:"data",
                id: chartId,
                url: dataUrl,
                dataName: this.dataSource,
                sortType: "unsort",
                showDataNum: this.$t('allData'),
                xAxisField: null,
                YAxisField: "",
                frequency: 5,
                legendPosition: "bottom",
                autoPlay:false
            }
            if( dataContent.dataSource === "api"){
                this.param.title = dataContent.label;
                this.param.option.title.text = dataContent.label;
                curChartParam.chartParam.dataSource = "api";
                curChartParam.chartParam.id = "api";
                curChartParam.chartParam.xAxisField = "second";
                curChartParam.chartParam.legendPosition = legendPosition;
                this.showApiData = true;
                this.param.chartParam = curChartParam.chartParam;
                this.param.chartParam.YAxisField = [];
                Bus.$emit("change-api-chart",this.param.id,"urlChange");
                this.getApiData(dataUrl);
                return;
            }
            this.showApiData = false;
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
        // 实时保存每个统计图表的配置信息
        chartConfigParam () {
            let param =JSON.parse(JSON.stringify(this.param));
            let {chartParam}=param;
            chartParam.sortType = this.sortType;
            chartParam.showDataNum = this.showDataNum;
            chartParam.xAxisField = this.xAxisField;
            chartParam.YAxisField = this.YAxisField;
            setTimeout(()=>{
                Bus.$emit("update-chartData", param);
            },500)
        },
        configChartWidget () {
            let param = this.param;
            let {width,height} = this.chartInitParam;
            param.style.width = (width||0)+"px";
            param.style.height = (height||0)+"px";
            return param;
        },
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
            option.series[0].data.map((item)=>{
                item.itemStyle = undefined;
            });
            this.updateOption();
        },

        // 改变图表的状态的方法 包含（ 图例位置 x y轴文字）
        changexRotate (val) {
            this.changeRotate(val,"xAxis");
        },
        changeyRotate (val) {
            this.changeRotate(val,"yAxis");
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
                    grid.bottom = 25;
	                legend.show = false;
	                break;
            }
            this.updateOption();
        },

        // 修改X Y轴文字倾斜
        changeRotate (state,direct) {
            let {option} = this.chartInitParam;
            if (state) {
                option[direct].axisLabel.rotate = -45;
            }else {
                option[direct].axisLabel.rotate = 0;
            }
            this.updateOption();
        },

        // 图表数据数量截取
        chartDataNum (value,init=false) {
            if(this.param.chartParam.id === "api"){
                let {YAxisField,xAxisField} = this.param.chartParam;
                if(YAxisField.length > 0 && xAxisField){
                    Bus.$emit("change-api-chart",this.param.id,"dataNum");
                }
                return;
            }
            if (typeof value ==="number") {
                // 当条形图时 截取数据是反向截取
                this.featuresData = this.interceptData.slice(0,value);
            }
            if (typeof value ==="string") {
                this.featuresData = this.interceptData;
            }
            if(init){
                return;
            }
            this.dataForAnnular();
        },

        // 根据修改 更新图表
        updateOption () {
            let {option,index} = this.chartInitParam;
            /* 在 ChartWidgets组件中 $on调用 实现实时更新对应的图表
                * option 更改后的图表option
                * index 为当前统计图 的下标值 与 container 组件中 对应的图表下标一直
                */
            // this.chartConfigParam();
            Bus.$emit("upadte-graph",option,index);
        },
        // 组装排序与截取的饼状图数据
        dataForAnnular () {
            let {option,chartParam} = this.chartInitParam;
            chartParam.YAxisField = this.dataYAxisField;
            let optionData = ChartDataUtil.formatPieSeriesData(this.featuresData,chartParam.xAxisField,chartParam.YAxisField);
            let pieLegend = ChartDataUtil.formatPieLegendData(this.featuresData,chartParam.xAxisField);
            option.series[0].data = optionData;
            option.legend.data = pieLegend;
            this.updateOption();
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
    .just-left {
        justify-content: flex-start;
    }
    .just-left > .auto-switch{
        margin-left: 20px;
        padding-top: 5px;
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

