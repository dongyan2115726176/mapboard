<template>
    <div id="module-scene">
        <div class="scene-list-span">
	        <span>{{$t("sceneList")}}：</span>
        </div>
        <i class="split-line"></i>
        <div class="scene-show">
            <div class="scene-search">
               <span class="f14">{{$t("searchPortalScene")}}：</span>
               <el-input
                    class="scene-search-input"
                    suffix-icon="md-icon-search"
                    v-model="keywords"
                    @input="getSceneList(1)"
                >
                </el-input>
	            <i class="f14 md-icon-refresh refresh"
	                @click="getSceneList(1)"
	            ></i>
            </div>
            <ul class="scene-list">
                <li v-for="(item,index) in sceneList"
                    :key="index"
                    @click="selectScene(index)"
                    class="scene-item"
                >
                    <div class="scene-list-img" :title="item.name">
                        <img  :src="item.thumbnail"  alt="no thumbnail">
                    </div>
                    <span class="map-text text-overflow" :title="item.name">{{item.name}}</span>
                </li>
            </ul>
            <p v-if="noSceneItem">{{$t("sceneSearchResultEmpty")}}</p>
            <el-pagination
                class="scene-pagination"
                small
                :pager-count="5"
                :current-page="1"
                layout="prev, pager, next"
                @current-change="getSceneList"
                :total="totalPage*10"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Bus from '../../../utils/eventBus';
export default {
    name: "Scene",
    data () {
        return {
            sceneList: null,
	        selectUrl: null,
            keywords: '',
            totalPage: 0,
            param: {
                currentPage:1,
                pageSize:6,
                permissionType:"READ",
                keywords:this.keywords
            },
        }
    },
    props:{
        baseSetting:{
            type: Object,
            required: true
        },
        widgetList:{
            type: Array,
            required: true
        }
    },
    created () {
        this.getPortalScenes();
    },
    computed: {
        noSceneItem () {
            if (this.sceneList && this.sceneList.length>0) {
                return false;
            }
            return true;
        },
    },
    methods:{
        // 为门户地图获取用户地图列表
        getPortalScenes () {
            let sceneListUrl = window.location.href.substring(0,window.location.href.indexOf("/apps/mapdashboard"))+
            `/web/scenes.json?sceneSearchParameter=${JSON.stringify(this.param)}&t=${new Date().getTime()}`;
            //下边这一句代码本机调试时需要打开！！
	        //sceneListUrl = `http://192.168.13.221:8090/iportal/web/scenes.json?sceneSearchParameter=${JSON.stringify(this.param)}&t=${new Date().getTime()}`;// dev
            //encodeURI是为了解决IE下请求错误问题
            sceneListUrl = encodeURI(sceneListUrl);
            this.$http.get(sceneListUrl)
            .then((res)=>this.handleSuccessRequest(res.data))
            .catch(()=>{
                this.$message({
                    type: 'warning',
                    message: this.$t("promptGetDataFailed")
                })
            })
        },
        handleSuccessRequest (data) {
            this.sceneList = data.content.map((sceneParam)=>{
                let {thumbnail,name,url,id} = sceneParam;
                return {thumbnail,name,url,id}
            });
            this.totalPage = data.totalPage;
        },
        // 检查是否公开or私有
        checkPrivate(url,curItem){
            let {id} = curItem;
            let sceneUrl = url+"/web/scenes/"+id+".json";
            this.$http.get(sceneUrl).then((res)=>{
                let {authorizeSetting,url,content} = res.data;
                if(!url){
                    this.selectUrl = JSON.parse(content).layers[0].url;
                }
                let isPublic = false;// 默认私有
                authorizeSetting.map((item)=>{
                    if(item.entityType === "USER" && item.entityName === "GUEST"){
                        isPublic = true;
                    }
                })
                if(!isPublic){
                    this.$message({
                        type: 'warning',
                        message: this.$t("promptPrivateScene")
                    })
	                return;
                }
                this.creatScene(curItem);
            })

        },
        // 检查当前是否有场景组件
        checkSceneOnly(){
            let onlyOne = false;
            for(let i=0;i<this.widgetList.length;i++){
                if(this.widgetList[i].type === "Scene"){
                    onlyOne = true;
                    break;
                }
            }
            return onlyOne;
        },
        /**
         * 选择获取的场景
          * @param index 场景的列表索引值
         */
        selectScene (index) {
            let onlyOne = this.checkSceneOnly();
            if(onlyOne){
                this.$message({
                    type: 'warning',
                    message: this.$t("supportOneScene")
                })
                return;
            }
            let curItem = this.sceneList[index];
            this.selectUrl = curItem.url;
            let href = window.location.href;
            let url = "http://192.168.13.221:8090/iportal";
            if(href.indexOf("/apps/mapdashboard") !== -1){
                url = href.slice(0,href.indexOf("/apps/mapdashboard"));
            }
            this.checkPrivate(url,curItem);
         },
        creatScene(curItem) {
            let style = {
                height: this.baseSetting.height,
                width: this.baseSetting.width,
                left: "0px",
                top: "0px"
            }
            let sceneParam = {
                type: "Scene",
                nls:"scene",
                title: curItem.name,
                icon:"md-icon-scene",
                id: new Date().getTime(),
                sceneId: curItem.id,
                sceneUrl:this.selectUrl,
	            positopn: null,
                fullScreen:true,
                scanEffect: {
                    status: false, //是否为开启状态
	                type: "noScan",
                    centerPostion: null,
                    _period: 2000,
	                speed: 500,
	                color: null
                },
                style
            }
            // 在App 组件中$on调用 为应用添加默认图表组件
            Bus.$emit("update-components",sceneParam);
		},
        // 搜索地图与下一页地图
        getSceneList (page) {
            this.param.currentPage = page;
            this.param.keywords = [this.keywords];
            this.getPortalScenes();
        }
    }
}
</script>

<style scoped>
    #module-scene {
        padding-right: 20px;
        padding-top: 19px;
    }
    .scene-list-span {
        font-size: 16px;
    }
    .scene-search {
        display: flex;
        display: -webkit-flex;
        align-items: baseline;
        justify-content: space-between;
        margin-top: 23px;
        margin-bottom: 0px;
    }
    .scene-search-input {
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
    .scene-list {
        margin-top: 3px;
        cursor: pointer;
        overflow: hidden;
    }
    .scene-list > .scene-item:nth-of-type(2n-1) {
        float: left;
    }
    .scene-list > .scene-item:nth-of-type(2n){
        float: right;
    }
    .scene-item {
        width: 100px;
        height: 100px;
        text-align: center;
        margin-top: 20px;
    }
    .scene-list-img {
        width: 96px;
        height: 70px;
    }
    .scene-list-img > img:hover {
        border: 1px solid ;
    }
    .scene-list-img > img {
        display: block;
        width: 100%;
        height: 100%;
    }
    .scene-item > .map-text {
        display: block;
        margin-top: 10px ;
    }
    .scene-pagination {
        margin-top: 30px;
        padding:0;
    }
</style>
<style>
    #module-scene .scene-pagination > button {
        padding:6px 0;
        padding-right:0px;
        padding-left:0px;
    }
    #module-scene .scene-pagination > .el-pager > li {
        padding:0;
    }
</style>

