<template>
    <div id="module-map">
        <div class="map-add">
            <el-button @click="showLiveData">{{$t("addLiveDataMap")}}</el-button>
        </div>
        <i class="split-line"></i>
        <div class="map-show">
            <div class="map-search">
               <span class="f14">{{$t("searchPortalMap")}}：</span>
               <el-input
                    class="map-search-input"
                    suffix-icon="md-icon-search"
                    v-model="keywords"
                    @input="getMapList(1)"
                >
                </el-input>
	            <i class="f14 md-icon-refresh refresh"
	               @click="getMapList(1)"
	            ></i>
            </div>
            <ul class="map-list">
                <li v-for="(item,index) in mapUnit"
                    :key="index"
                    @click="selectMap(index)"
                    class="map-item"
                >
                    <div class="map-list-img" :title="item.title">
                        <img  :src="item.thumbnail"  alt="no thumbnail">
                    </div>
                    <span class="map-text text-overflow" :title="item.title">{{item.title}}</span>
                </li>
            </ul>
            <p v-if="noMapItem">{{$t("promptSearchResultEmpty")}}</p>
            <el-pagination
                class="map-pagination"
                small
                :pager-count="5"
                :current-page="1"
                layout="prev, pager, next"
                @current-change="getMapList"
                :total="totalPage*10"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Bus from '../../../utils/eventBus';
export default {
    name: "Map",
    data () {
        return {
            mapUnit: null,
            keywords: '',
            totalPage: 0,
            param: {
                currentPage:1,
                pageSize:6,
                excludeIds:[],
                keywords:this.keywords,
                sourceTypes:[],
                permissionType:"READ",
                checkStatus:"SUCCESSFUL"
            },
        }
    },
    props:{
        baseSetting:{
            type:Object,
            required:true
        }
    },
    created () {
        this.getPortalMap();
    },
    computed: {
        noMapItem () {
            if (this.mapUnit && this.mapUnit.length>0) {
                return false;
            }
            return true;
        },
    },
    methods:{
        // 为门户地图获取用户地图列表
        getPortalMap () {
            let mapListUrl = window.location.href.substring(0,window.location.href.indexOf("/apps/mapdashboard"))+
            `/web/maps.json?mapSearchParameter=${JSON.stringify(this.param)}&t=${new Date().getTime()}`;
            //下边这一句代码本机调试时需要打开！！
	        //mapListUrl = `http://192.168.13.221:8090/iportal/web/maps.json?mapSearchParameter=${JSON.stringify(this.param)}&t=${new Date().getTime()}`;// dev
            //encodeURI是为了解决IE下请求错误问题
            mapListUrl = encodeURI(mapListUrl);
            this.$http.get(mapListUrl)
            .then((res)=>this.handleSuccessRequest(res.data))
            .catch(()=>{
                this.$message({
                    type: 'warning',
                    message: this.$t("promptGetDataFailed")
                })
            })
        },
        handleSuccessRequest (data) {
            this.mapUnit = data.content.map((mapParam)=>{
                let {thumbnail,title,sourceType,id} = mapParam;
                let type = sourceType;
                return {thumbnail,title,type,id}
            });
            this.totalPage = data.totalPage;
        },
        // 选择获取的地图
        selectMap (index) {
            let curItem = this.mapUnit[index];
            let href = window.location.href;
            let url = "http://192.168.13.221:8090/iportal";
            if(href.indexOf("/apps/mapdashboard") !== -1){
                url = window.MD.hrefHead;
            }
            this.checkMapPrivate(curItem,url);
        },
        checkMapPrivate(curItem,url){
            //http://192.168.13.121:8090/iportal/web/maps/255491744.json
	        let mapUrl;
	        if (url.indexOf("utils/template/data") !== -1){
                mapUrl = url;
	        }else{
                mapUrl = url+"/web/maps/"+curItem.id+".json";
            }
            this.$http.get(mapUrl).then((res)=>{
                let {authorizeSetting} = res.data;
                 let isPublic = false;
                authorizeSetting.map((item)=>{
                    if(item.entityType === "USER" && item.entityName === "GUEST"){
                        isPublic = true;
                    }
                })
                if(!isPublic){
                    this.$message({
                        type: 'warning',
                        message: this.$t("promptPrivateMap")
                    })
                }
                this.creatMap(curItem,url)
            })
        },
         creatMap(curItem,url) {
            let zoom = 0,center = [0,0]; // level 目前获取都为null
            let style = {
                height: this.baseSetting.height,
                width: this.baseSetting.width,
                left: "0px",
                top: "0px"
            }
            let mapParam = {
                type: "Map",
                nls:"map",
                title: curItem.title,
                icon:"md-icon-map-widget",
                id: new Date().getTime(),
                mapId: curItem.id,
                mapUrl:url,
                center:center,
                zoom:zoom,
                fullScreen:true,
                scaleLine: false, // 比例尺
                overviewMap: false, // 鹰眼
                style
            }
            // 在App 组件中$on调用 为应用添加默认图表组件
            Bus.$emit("update-components",mapParam);
		},
        // 搜索地图与下一页地图
        getMapList (page) {
            this.param.currentPage = page;
            this.param.keywords = [this.keywords];
            this.getPortalMap();
        },
        // 显示时态数据弹窗
        showLiveData(){
            let params = {
                title:this.$t("dataFlow"),
                path:"left-panel/modules/LiveDataSetting",
                params:this.baseSetting
            }
            Bus.$emit("show-popup",true,params); //Map.vue -> App.vue
        }
    }
}
</script>

<style scoped>
    #module-map {
        padding-right: 20px;
        padding-top: 10px;
    }
    .map-add {
        text-align: center;
    }
    .map-add > button {
        width: 209px;
        height: 30px;
        margin-bottom: 5px;
        font-size: 14px;
        border-radius: 0px;
    }
    .map-search {
        display: flex;
        display: -webkit-flex;
        align-items: baseline;
        justify-content: space-between;
        margin-top: 23px;
        margin-bottom: 0px;
    }
    .map-search-input {
        width: 110px;
        height:28px;
    }
    .refresh {
	    line-height: 28px;
	    cursor: pointer;
    }
    .refresh:hover {
	    color: #13A2FC;
    }
    .map-list {
        margin-top: 3px;
        cursor: pointer;
        overflow: hidden;
    }
    .map-list > .map-item:nth-of-type(2n-1) {
        float: left;
    }
    .map-list > .map-item:nth-of-type(2n){
        float: right;
    }
    .map-item {
        width: 100px;
        height: 100px;
        text-align: center;
        margin-top: 20px;
    }
    .map-list-img {
        width: 96px;
        height: 70px;
    }
    .map-list-img > img:hover {
        border: 1px solid #13A2FC;
    }
    .map-list-img > img {
        display: block;
        width: 100%;
        height: 100%;
    }
    .map-item > .map-text {
        display: block;
        margin-top: 10px ;
    }
    .map-pagination {
        margin-top: 30px;
        padding: 0;
    }
</style>
<style>
    #module-map .map-pagination > button {
        padding: 6px 0;
        padding-right: 0px;
        padding-left: 0px;
    }
    #module-map .map-pagination > .el-pager > li {
        padding:0;
    }
</style>

