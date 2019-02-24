<template>
    <div id="indicator-setting">
        <div class="flex-row">
            <span class="f14 row-line-height">{{$t("dataSourceType")}}：</span>
            <el-select
                class="list-size"
                v-model="indicatorParams.dataSource"
                size="mini"
                @change="dataSourceChange"
            >
                <el-option
                    v-for="item in sourceOption"
                    :key="item.label"
                    :label="item.label"
                    :value="item.type"
                >
                </el-option>
            </el-select>
        </div>
        <div class="flex-row" v-show="showApiDataSet">
            <span class="f14 row-line-height">{{$t("dataSource")}}：</span>
            <el-select
                class="list-size"
                size="mini"
                v-model="indicatorParams.url"
                @change="onSelectApiData"
            >
                <el-option
                    v-for="item in apiData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("headline")}}：</span>
            <el-input
                class="list-size"
                v-model="indicatorParams.title"
                :placeholder="$t('title')"
                @input="setIndicatorParam"
            >
            </el-input>
        </div>
        <div class="flex-row" v-show="!showApiDataSet">
            <span class="f14">{{$t("data")}}：</span>
            <el-input
                class="list-size"
                v-model="indicatorParams.num"
                :placeholder="$t('data')"
                @input="setIndicatorParam"
            >
            </el-input>
        </div>
        <div class="flex-row" v-show="showApiDataSet">
            <span class="f14">{{$t("autoRefresh")}}：</span>
            <div class="list-size">
                <el-input
                    class="list-size-mini"
                    v-model="indicatorParams.frequency"
                    @input="setIndicatorParam"
                >
                </el-input>
                <span class="f14">{{$t("onceSecond")}}</span>
            </div>
        </div>
        <div class="flex-row" v-show="showApiDataSet">
            <span class="f14">{{$t("dataField")}}：</span>
            <el-cascader
                class="list-size"
                :options="apiFieldOption"
                v-model="indicatorParams.field"
                @change="setIndicatorParam"
            >
            </el-cascader>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("unit")}}：</span>
            <el-input
                class="list-size"
                v-model="indicatorParams.unit"
                :placeholder="$t('indicatorUnit')"
                @input="setIndicatorParam"
            >
            </el-input>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("fontSize")}}：</span>
            <div class="list-size">
                <el-input
                    class="list-size-mini"
                    v-model="indicatorParams.fontSize"
                    size="mini"
                    @input="setIndicatorParam"
                >
                </el-input>
                <span class="f14">{{$t("px")}}</span>
            </div>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("fontColor")}}：</span>
            <el-color-picker
                class="list-size"
                v-model="indicatorParams.fontColor"
                show-alpha
                :predefine="predefineColors"
                @change="setIndicatorParam"
            >
            </el-color-picker>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("componentSize")}}：</span>
        </div>
        <div class="flex-row">
            <div>
                <span class="f13">{{$t("width")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="indicatorParams.width"
                    size="mini"
                    @input="setIndicatorParam"
                >
                </el-input>
            </div>
            <div>
                <span class="f13">{{$t("height")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="indicatorParams.height"
                    size="mini"
                    @input="setIndicatorParam"
                >
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"IndicatorSetting",
        data () {
            return {
                sourceOption: [ // 选择指标来源列表
                    {label:this.$t("staticData"),type:"static"},
                    // {label:"地图图层",type:"map"},
                    {label: "API",type:"server"},
                ],
                showApiDataSet:false, // 隐藏来源服务型的设置
                predefineColors:["#3eb0e7","#7bc684","#ce7f4a"], //自定义默认颜色推荐选项
                apiData:[], // apiData数据
                apiFieldOption:[]
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
        created(){
            this.getApiData(this.dataList);
            let {dataSource,url} = this.param;
            if(dataSource === "server" && url){
                this.onSelectApiData(url);
            }
        },
        watch:{
            dataList(data){
                this.getApiData(data);
            }
        },
        computed:{
            indicatorParams(){
                let {dataSource,title,num,unit,fontSize,fontColor,agent,url="",field=[],frequency=60,style:{width,height}} = this.param;
                width = parseInt(width);
                height = parseInt(height);
                fontSize = parseInt(fontSize);
                if(dataSource === "server"){
                    this.showApiDataSet = true;
                    if(url && field.length >0 ){
                        this.onSelectApiData(url);
                    }
                }else{
                    this.showApiDataSet = false;
                }
                return {dataSource,title,num,unit,fontSize,fontColor,agent,url,field,frequency,width,height};
            }
        },
        methods: {
            // 获取API data列表
            getApiData(dataList){
                dataList.map((item)=>{
                    if(item.dataSource === "api"){
                        this.apiData.push(item);
                    }
                })
            },
            // 获取当前的API数据信息
            getApiDataContent(url){
                for(let i=0;i<this.apiData.length;i++){
                    if(this.apiData[i].value === url){
                        return this.apiData[i];
                    }
                }
            },
            // 选择API数据
            onSelectApiData(url){
                let {agent} = this.getApiDataContent(url);
                this.param.agent = agent;
                let params = this.param;
                params.url = url;
                let crossUrl = url;
                if(agent && window.location.href.indexOf("/apps/mapdashboard") > -1){
                    crossUrl = window.MD.hrefHead + "/apps/viewer/getUrlResource.json?url=" + encodeURIComponent(url);
                }
                this.$http.get(crossUrl).then((res)=>{
                    this.apiFieldOption = [];
                    let dataContent = res.data
                    if(typeof(dataContent) === "string"){
                        dataContent = JSON.parse(dataContent);
                    }
                    this.initFieldOption(dataContent);
                });
            },
            // 转换数据结果 JSON数据转换出element-ui多层结构
            forInOption(dataContent,children){
                for(let i in dataContent){
                    if(!(dataContent[i] instanceof Array)){
                        let data = {
                            label:i,
                            value:i
                        }
                        if(dataContent[i] instanceof Object){
                            data.children = [];
                            data.children = this.forInOption(dataContent[i],data.children);
                        }
                        children.push(data);
                    }
                }
                return children;
            },
            // 组装字段option
            initFieldOption(dataContent){
                this.apiFieldOption = this.forInOption(dataContent,this.apiFieldOption)
            },
            // 初始化指标参数
            indicatorConfigParam(){
                let params = this.param;
                let localParams = this.indicatorParams;
                params.dataSource = localParams.dataSource;
                params.title = localParams.title;
                params.num = localParams.num;
                params.unit = localParams.unit;
                params.fontSize = (localParams.fontSize||0) + "px";
                params.fontColor = localParams.fontColor;
                params.style.width = (localParams.width||0)+"px";
                params.style.height = (localParams.height||0)+"px";
                params.url = localParams.url;
                params.frequency = localParams.frequency;
                params.field = localParams.field;
                return params;
            },
            setIndicatorParam(){
                return this.indicatorConfigParam();
            },
            // 数据形式选择
            dataSourceChange(source){
                if(source === "server"){
                    this.showApiDataSet = true;
                }else{
                    this.showApiDataSet = false;
                }
                this.setIndicatorParam();
                this.param.num = 0;
            }
        }
    }
</script>
<style scoped>
    #indicator-setting {
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


