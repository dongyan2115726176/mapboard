<template>
    <div id="textList-setting">
        <!-- 数据来源 -->
        <div class="flex-row">
            <span class="f14 row-line-height">{{$t("dataSource")}}：</span>
            <el-select
                class="list-size"
                size="mini"
                v-model="textListParams.dataSource"
                @change="getGraphData"
            >
                <el-option
                    v-for="item in iportalData"
                    :key="item.dataId"
                    :label="item.label"
                    :value="item.dataId"
                >
                </el-option>
            </el-select>
        </div>
        <!-- 表头 -->
        <div class="flex-row">
            <span class="f14">{{$t("header")}}：</span>
            <el-input
                class="list-size"
                :placeholder="$t('title')"
                v-model="textListParams.headTitleStr"
                @input="changeHeadTitle"
            >
            </el-input>
        </div>
        <!-- 数据列 -->
        <div class="flex-row">
            <span class="f14 row-line-height">{{$t("dataColumn")}}：</span>
            <el-select
                class="list-size"
                :multiple="true"
                collapse-tags
                size="mini"
                v-model="textListParams.textListParam.dataColumn"
                @change="dataForDataColumn"
            >
                <el-option
                    v-for="(item,index) in dataColumnOption"
                    :key="index"
                    :label="item"
                    :value="item"
                    :title="item"
                    class="chart-setting-select"
                >
                </el-option>
            </el-select>
        </div>
        <!-- 自动刷新 -->
        <div class="flex-row">
            <span class="f14">{{$t("autoRefresh")}}：</span>
            <div class="list-size">
                <el-input
                    class="list-size-mini"
                    v-model="textListParams.textListParam.frequency"
                    @input="setTextListParam"
                >
                </el-input>
                <span class="f14">{{$t("onceSecond")}}</span>
            </div>
        </div>
        <!-- 刷新方式 -->
        <div class="flex-row">
            <span class="f14 row-line-height">{{$t("refreshMethods")}}：</span>
            <el-select
                class="list-size"
                size="mini"
                v-model="textListParams.textListParam.refreshMethod"
                @change="setTextListParam"
            >
                <el-option
                    v-for="(item,index) in refreshMethodOption"
                    :key="index"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </div>
        <!-- 列表行数 -->
        <div class="flex-row">
            <span class="f14 row-line-height">{{$t("listRows")}}：</span>
            <el-select
                class="list-size"
                size="mini"
                v-model="textListParams.textListParam.dataRows"
                @change="changeRow"
            >
                <el-option
                    v-for="item in showDataRowsOption"
                    :key="item.dataId"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </div>
        <!-- 字体大小 -->
        <div class="flex-row">
            <span class="f14">{{$t("fontSize")}}：</span>
            <div class="list-size">
                <el-input
                    class="list-size-mini"
                    v-model="textListParams.fontSize"
                    size="mini"
                    @input="setTextListParam"
                >
                </el-input>
                <span class="f14">{{$t("px")}}</span>
            </div>
        </div>
        <!-- 字体颜色 -->
        <div class="flex-row">
            <span class="f14">{{$t("fontColor")}}：</span>
            <el-color-picker
                class="list-size"
                v-model="textListParams.fontColor"
                show-alpha
                :predefine="predefineColors"
                @change="setTextListParam"
            >
            </el-color-picker>
        </div>
        <span class="x-setting-line"></span>
        <!-- 组件尺寸 -->
        <div class="flex-row">
            <span class="f14">{{$t("componentSize")}}：</span>
        </div>
        <!-- 宽 高 -->
        <div class="flex-row">
            <div>
                <span class="f13">{{$t("width")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="textListParams.width"
                    size="mini"
                    @input="setTextListParam"
                >
                </el-input>
            </div>
            <div>
                <span class="f13">{{$t("height")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="textListParams.height"
                    size="mini"
                    @input="setTextListParam"
                >
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from "../../../../utils/eventBus";
import ChartDataUtil from "../../../../utils/chartDataUtil.js";
import { isArray } from 'util';
    export default {
        name:"TextListSetting",
        data () {
            return {
                showApiDataSet:false, // 隐藏来源服务型的设置
                predefineColors:["#3eb0e7","#7bc684","#ce7f4a"], //自定义默认颜色推荐选项
                dataColumnOption:[],
                refreshMethodOption:["逐条滚动","同时滚动"],
                showDataRowsOption:[5,6,8,10],
                valArr:[]
            }
        },
        props:{
            param:{
                type:Object,
                required:true
            },
            dataList:{
                type:Array,
                required:true
            }
        },
        computed:{
            //初始化参数
            textListParams(){
                let {id,headTitle,fontSize,fontColor,dataSource,animate,textListParam,textListParam:{frequency=60},style:{width,height}} = this.param;
                width = parseInt(width);
                height = parseInt(height);
                fontSize = parseInt(fontSize);
                let headTitleStr = headTitle.join(",");
                return {id,headTitleStr,fontSize,fontColor,dataSource,animate,textListParam,frequency,width,height};
            },
            //数据来源
            iportalData(){
                let dataArr = [];
                for(let i=0;i<this.dataList.length;i++){
                    if(this.dataList[i].dataSource === "data"){
                        dataArr.push(this.dataList[i]);
                    }
                }
                return dataArr;
            }
        },
        methods: {
            //多选筛选数据
            dataForDataColumn(val){
                this.valArr = val
                let headArr = [];
                let headerContent = window.chartData[this.param.dataSource].xAxisFieldList;
                headerContent.map((item)=>{
                    if(val.indexOf(item)>-1){
                        headArr.push(item)
                    }
                })
                this.param.headTitle = headArr;

                let allData = window.chartData[this.param.dataSource].features.slice(0,this.param.textListParam.dataRows);
                let content = [];
                allData.map((item)=>{
                    let obj = {};
                    headArr.map((key)=>{obj[key] = item[key]})
                    content.push(obj)
                })
                this.param.content = content;
            },      
            // 根据data url 获取信息
            getDataObj(dataId){
                for(let i=0;i<this.iportalData.length;i++){
                    if(this.iportalData[i].dataId === dataId){
                        return this.iportalData[i];
                    }
                }
            },
            changeHeadTitle(){
                //兼容中英文逗号
                let localParams = this.textListParams;
                let oldValue = localParams.headTitleStr;
                let newValue;
                    while(oldValue.indexOf("，")!=-1){  //寻找每一个中文逗号，并替换
                       newValue=oldValue.replace(/，/ig,',');
                       oldValue=newValue;
                     }
                    newValue = oldValue;
                    if(typeof newValue === "string"){
                        newValue = newValue.split(",");
                        localParams.headTitleStr  = newValue;
                    }else{
                        localParams.headTitleStr  = newValue;
                    }
                    this.param.headTitle = newValue;
            },
            // 选择数据触发
            getGraphData (dataId) {
                if(this.textListParams.textListParam.dataColumn !== []){
                    this.textListParams.textListParam.dataColumn = [];
                }
                let dataContent = this.getDataObj(dataId);
                let curTextListParam = JSON.parse(JSON.stringify(this.param));
                let {refreshMethod}  = curTextListParam.textListParam;
                curTextListParam.textListParam.refreshMethod = refreshMethod;
                if(window.chartData[dataId]){
                    console.log("当前数据已经初始化过！")
                }else{
                    let dataParam = {
                        chartParam:{
                            url:dataContent.value,
                            id:dataContent.dataId
                        }
                    }
                    ChartDataUtil.getData(dataParam,true);
                }
                let data = window.chartData[dataId];
                this.param.dataSource = dataContent.dataId;
                this.param.headTitle = data.xAxisFieldList;
                this.param.content = data.features.slice(0,this.textListParams.textListParam.dataRows);
                this.dataColumnOption = data.xAxisFieldList;
            },
            //展示数据行数
            changeRow(val){
                this.param.textListParam.dataRows = val;
                window.chartData[this.param.dataSource].features.slice(0,this.param.textListParam.dataRows);
                this.dataForDataColumn(this.valArr)
            },
            // 初始化文本列表参数
            textListConfigParam(){
                let params = this.param;
                let localParams = this.textListParams;
                params.fontSize = (localParams.fontSize||0) + "px";
                params.fontColor = localParams.fontColor;
                params.style.width = (localParams.width||0)+"px";
                params.style.height = (localParams.height||0)+"px";
                params.textListParam.dataColumn = localParams.textListParam.dataColumn;
                params.textListParam.frequency = localParams.frequency;
                return params;
            },
            setTextListParam(){
                return this.textListConfigParam();
            }
        }
    }
</script>
<style scoped>
    #textList-setting {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        padding: 0 20px;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .flex-row > span {
        line-height: 28px;
    }
    .flex-row > .list-size {
        width: 163px;
        height: 28px;
    }
    .flex-row .list-size-mini {
        width: 110px;
        height: 28px;
    }
    .mini-input {
        width: 64px;
        height: 28px;
    }
    .x-setting-line {
        margin-top: 13px;
    }
</style>