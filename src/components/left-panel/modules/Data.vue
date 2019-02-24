<template>
    <vue-scrollbar
        class="data-scrollbar"
        ref="dataScrollbar"
    >
        <div id="module-data">
            <div class="map-add">
                <el-button @click.stop="addApiData">+{{$t("addApiData")}}</el-button>
            </div>
            <!-- 已选列表DOM -->
            <div class="data-head flex-row-between">
                <p class="f16 data-head-title">{{$t("selecetedDatas")}}：</p>
            </div>
            <i class="split-line"></i>
            <div
                class="data-select-content flex-row-between"
                v-for="(item,index) in dataSelectList"
                :key="index"
            >
                <span class="f13 text-overflow data-list-name">{{item.label}}</span>
                <i class="md-icon-delete" @click.stop="deleteDataList(index)"></i>
            </div>
            <i class="split-line"></i>
            <!-- 可选列表DOM -->
            <div class="data-search-wrap flex-row-between">
                <span class="f14" style="align-self: center;">{{$t("myDatas")}}：</span>
                <el-input
                    v-model="keywords.text"
                    suffix-icon="md-icon-search"
                    size="mini"
                    class="data-search-input"
                    @input="searchFilter"
                >
                </el-input>
	            <i class="f14 md-icon-refresh refresh"
	               @click="getRequestData(1)"
	            ></i>
            </div>
            <div
                class="data-option-content flex-row-between"
                v-for="item in dataOptionList"
                :key="item.id"
                @click.stop="addDataList(item)"
            >
                <i class="md-icon-plus"></i>
                <span class="f13 text-overflow data-list-name" :title="item.fileName">{{item.fileName}}</span>
                <span class="data-list-type">{{item.type}}</span>
            </div>
            <el-pagination
                class="data-pagination"
                layout="prev, pager, next"
                @current-change="pageGetPortalData"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                small
            >
            </el-pagination>
        </div>
    </vue-scrollbar>
</template>

<script>
import Bus from "../../../utils/eventBus";
import VueScrollbar from 'vue2-scrollbar' //滚动条组件
export default {
    name:"Data",
    data () {
        return {
            myDataSearch: {}, // 搜索我的数据关键字
            currentPage: 1, // 当前分页
            total: null, // 总数据数量
            pageSize: 10, // 一页几条数据
            keywords: {  // 关键字过滤
                text:null,
                saveTimeOut:null
            },
            dataOptionList: [], // 渲染可选的数据列表
        }
    },
    props:{
        dataList:{
            type: Array,
            required: true
        }
    },
    components:{
        VueScrollbar
    },
    created(){
        this.getRequestData(1);
        Bus.$on("add-api-data",(param)=>{
            this.dataList.push(param);
        })
    },
    computed:{
        dataSelectList(){
            let list = this.dataList;
            return list;
        }
    },
    methods: {
        // 添加Api数据
        addApiData(){
            let params = {
                title: this.$t("addApiData"),
                path:"left-panel/liveData/LiveDataForApi",
                params: this.dataList
            }
            Bus.$emit("show-popup",true,params);
        },
        // 检查数据是否重复
        checkRepeat(id){
            let isRepeat = false;
            this.dataList.map((data)=>{
                if(data.dataId == id){
                    isRepeat = true;
                    this.$message({
                        message: this.$t("promptRepetitiveData"),
                        type: 'warning'
                    });
                }
            })
            return isRepeat;
        },
        // 删除数据
        deleteDataList(index){
            this.dataList.splice(index,1);
        },
        // 添加数据
        addDataList(data){
            let {fileName,id,type} = data;
            if(type == "CSV" || type == "JSON" || type == "EXCEL" || type == "GEOJSON"){
                let url = this.getDataContentUrl(id);
                let list = {
                    label: fileName,
                    value: url,
                    type: type,
                    dataId:id,
                    dataSource:"data" // 数据来源 我的数据
                };
                if(!this.checkRepeat(id)){
                    this.dataList.push(list);
                }
            }else{
                return this.$message.error(this.$t("promptFormatError"));
            }
        },
        // 搜索过滤数据
        searchFilter(val){
            clearTimeout(this.keywords.saveTimeOut);
            this.keywords.text = val;
            this.keywords.saveTimeOut = setTimeout(()=>{
                this.getRequestData(1);
            },800)
        },
        // 点击分页获取数据
        pageGetPortalData(val){
            this.getRequestData(val);
        },
        // 发送获取数据的请求 参数：当前分页 过滤关键字
        getRequestData(currentPage){
            this.currentPage = currentPage;
            let url = this.getDataUrl();
            let searchStr = "CSV,JSON,EXCEL,GEOJSON";
            if(this.keywords.text){
                searchStr = this.keywords.text;
            }
            url = url+"?t="+Date.parse(new Date())+"&currentPage="+currentPage
                +"&pageSize="+this.pageSize+"&orderBy=LASTMODIFIEDTIME&orderType=DESC"
                +"&keywords=["+searchStr+"]&permissionType=DOWNLOAD"
                +"&filterFields=['FILENAME','TYPE']";
            url = encodeURI(url);
            this.$http.get(url).then((res)=>{
                let dataContent = res.data.content;
                this.dataOptionList = dataContent;
                this.total = res.data.total;
                this.totalPage = res.data.totalPage;
            }).catch((err)=>{
                this.$message({
                    showClose: true,
                    message: this.$t("promptGetMyDatasFailed"),
                    type: 'error'
                })
            })
        },
        // 获取单个数据地址
        getDataContentUrl(id){
            let href = window.location.href;
            // 本地调试
            let url = "http://www.supermapol.com/web/datas/"+id+"/content.json";
            if(href.indexOf("/apps/mapdashboard") !== -1){
                url = href.slice(0,href.indexOf("/apps/mapdashboard")) + "/web/datas/"+id+"/content.json";
            }
            return url;
        },
        // 获取我的数据地址
        getDataUrl(){
            let href = window.location.href;
            // 本地调试
            let url = "http://www.supermapol.com/web/datas.json";
            if(href.indexOf("/apps/mapdashboard") > -1){
                url = href.slice(0,href.indexOf("/apps/mapdashboard")) + "/web/datas.json";
            }
            return url;
        }
    }

}
</script>

<style scoped>
    .data-scrollbar {
        max-height: calc(100% - 50px);
    }
    #module-data {
        height: 100%;
        padding-right: 20px;
        padding-top: 19px;
    }
    .map-add > button {
        width: 209px;
        height: 30px;
        margin-bottom: 20px;
        font-size: 14px;
        border-radius: 0px;
    }
    .flex-row-between {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .data-search-wrap {
        margin-bottom: 22px;
    }
    .data-select-content {
        font-size: 13px;
        margin-bottom: 22px;
    }
    .data-select-content > .md-icon-delete {
        color: #5D636A;
        cursor: pointer;
    }
    .data-select-content > .md-icon-delete:hover {
        color: #BDC9D4;
    }
    .data-head-title{
        margin-bottom: 0px;
    }
    .data-option-content > .md-icon-plus {
        width: 25px;
        font-size: 12px;
    }
    .data-search-input {
        width: 110px;
        height: 28px;
    }
    .refresh {
	    line-height: 28px;
	    cursor: pointer;
    }
    .refresh:hover {
         color: #13A2FC;
     }
    .data-option-content {
        font-size: 13px;
        margin-bottom: 22px;
        cursor: pointer;
    }
    .data-option-content:hover {
        color: #13A2FC;
    }
    .data-option-content > i {
        line-height: 18px;
    }
    .data-list-name {
        width: 150px;
    }
    .data-pagination {
        margin-top: 10px;
        padding:0;
    }
</style>
<style>
    #module-data .data-pagination > button {
        padding:6px 0;
        padding-right:0px;
        padding-left:0px;
    }
    #module-data .data-pagination > .el-pager > li {
        padding:0;
    }
    .el-input__suffix-inner {
        width: 14px;
        height: 14px;
    }
</style>

