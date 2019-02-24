<template>
    <div 
        id="app"
    >
        <div
            id="app-loading"
            v-if="loadingState"
        >
            <img :src="loadingImg" alt="">
        </div>
        <div class="edit-state-wrap" v-if="!toPreview">
            <Header
                :app-config="appConfig?appConfig:{}"
                @save-config="saveConfig"
                @open-preview="openPreview"
            />
            <div class="app-content">
                <canvas id="app-content-canvas" ref="appContent" width="2880px" height="1620px"></canvas>
                <SelectPanel
                    :widget-list="appContent?appContent.components:[]"
                    :data-list="appContent?appContent.dataList:[]"
                    :base-setting="appContent?appContent.baseSetting:{}"
                />
                <EditContainer
                    :widget-list="appContent?appContent.components:[]"
                    :base-setting="appContent?appContent.baseSetting:{}"
                />
                <SettingPanel
                    :data-list="appContent?appContent.dataList:[]"
                    :base-setting="appContent?appContent.baseSetting:{}"
                    :app-config="appConfig?appConfig:{}"
                />
            </div>
            <!-- 大屏交互中转组件 -->
            <Transfer
                :widget-list="appContent?appContent.components:[]"
            />
            <PublicPopup
                v-if="showPopup"
                :show-popup.sync="showPopup"
                :popupParams="popupParams"
            />
        </div>
        <div class="preview-state-wrap" v-if="toPreview">
            <PreviewContainer
                :widget-list="appContent?appContent.components:[]"
                :base-setting="appContent?appContent.baseSetting:{}"
            />
        </div>
  </div>
</template>

<script>
    import './assets/css/MDCommon.css'
    import './assets/css/MDIconFont.css'
    import './assets/css/MDElement-ui.css'
    import './assets/css/vueDraggableResizable.css'
    import Bus from "./utils/eventBus"
    import Header from "./components/Header"
    import EditContainer from "./components/Container"
    import PreviewContainer from "./view/Container"
    import SelectPanel from "./components/SelectPanel"
    import SettingPanel from "./components/SettingPanel"
    import PublicPopup from './components/common/PublicPopup'
    import ChartDataUtil from "./utils/chartDataUtil"
    import MDLoading from "./assets/images/MDLoading.gif"
    import compatibleConfig from "./utils/compatibleConfig"
    import Transfer from "./components/common/Transfer"
    export default {
        name: 'App',
        data () {
            return {
                showPopup:false, // 是否显示公用弹窗
                popupParams:{},// 共用弹窗所需传递参数
                appConfig: null,
                appContent: null,
                getConfigUrl: null,
                toPreview:false, // 开启预览模式
                loadingState:true, // 默认开始loading状态
                loadingImg:MDLoading,
                saveConfigUrl:"", //保存地址
	            mapDashboardID: null,  //大屏的id，再次编辑时记录id，给保存使用；
                userPowers:false // 验证用户对APP的权限信息
            }
        },
        created () {
            let href = window.location.href;
            window.MD.hrefHead = href.slice(0,href.indexOf("/apps/mapdashboard"));
            this.saveConfigUrl = window.MD.hrefHead+"/web/mapdashboards";
            window.MD.appState = "create";
            if(href.indexOf("?action=view") > -1){
                window.MD.appState = "view";
            }else if(href.indexOf("/apps/mapdashboard/") > -1){
                window.MD.appState = "edit";
            }
            if(window.MD.appState === "view"){
                this.appConfig = JSON.parse(window.localStorage.getItem("MapDashBoard"));
                this.appContent = this.appConfig.content;
                this.getChartUrlData(this.appContent.dataList);
                this.toPreview = true;
            }else{
                if(href.indexOf("/apps/mapdashboard") !== -1){
                    this.getUserAppsInformation();
                }else{
                    this.getBaseConfig();
                }
            }
            // 显示共用弹窗组件并传递参数
            Bus.$on("show-popup",(state,params)=>{
                if(state){
                    this.popupParams = params;
                    this.showPopup = true;
                }else{
                    this.popupParams = {};
                    this.showPopup = false;
                }
            })
            /* 在Chart Other Text Indicator 组件中$emit定义
             * 为应用添加或删除图表组件
             * item类型为 number时 是删除操作 对应删除的下标值
             * item类型另一种为 object 是增加操作 内容为默认组件信息
             */
            Bus.$on("update-components",(item)=>{
                if (typeof item ==="number") {
                    this.appContent.components.splice(item,1);
                } else {
                    this.appContent.components.push(item);
                    Bus.$emit("created-widget",item);
                }
            });
            // 用户修改名称 标签 描述 更新
            Bus.$on("update-userConfig",(params)=>{
                let {name,description,tags} = params;
                this.appConfig.name = name;
                this.appConfig.tags = tags;
                this.appConfig.description = description;
                this.createdPostConfig(params.state);
            });
            // 更新数据列表
            Bus.$on("update-widgetList",(widgetList)=>{
                this.appContent.components = widgetList;
                this.appConfig.content = this.appContent;
            });
            // 更新整个config
            Bus.$on("update-appConfig",(appConfig)=>{
                this.appContent = appConfig;
                this.getChartUrlData(this.appContent.dataList);
            });
            // 更新authorizeSetting
            Bus.$on("update-authorizeSetting",(authorizeSetting)=>{
                this.appConfig.authorizeSetting = authorizeSetting;
            });
            //监听页面关闭通知
            window.onbeforeunload = function (e) {
                let msg;
                if (window.lang === "zh-CN"){
	                msg = "系统可能不会保留你的更改";
                }else{
	                msg = "Your changes may not be retained by the system";
                }
                e = e || window.event;
                //兼容老版本浏览器
                if (e) {
                    e.returnValue = msg;
                }
                return msg;
            };
            let explorer = window.navigator.userAgent;
            let reg = /(Trident)|(Edge)|(Firefox)/;
            if(reg.test(explorer)){
                this.$alert(this.$t("bestChrome"), {
                    confirmButtonText: this.$t("confirm")
                });
            }
        },
        components: {
            Header,
            EditContainer,
            PreviewContainer,
            SelectPanel,
            SettingPanel,
            PublicPopup,
            Transfer
        },
        mounted(){
            if(window.MD.appState !== "view"){
                var canvas = this.$refs.appContent;
                let context = canvas.getContext('2d');
                this.drawGrid(context,"rgba(82,93,100,0.5)", 24, 24);
            }
	        if(window.MD.appState === "create"){
                 // 开启模版选择
                 let params = {
                     title: this.$t("seleceteTemplate"),
                     path: "common/Template",
                     params:{}
                 }
                 Bus.$emit("show-popup",true,params);
            }
        },
        methods: {
            // 获取用户对APP的权限信息
            getUserAppsInformation(){
                let url = `${window.MD.hrefHead}/web/config/userprofile.json`;
                this.$http.get(url).then((res)=>{
                    res.data.editableWebApps.map((item)=>{
                        if(item === "MAPDASHBOARD"){
                            this.userPowers = true;
                        }
                    })
                    this.getBaseConfig();
                })
            },
            // 新开页面预览
            openPreview(){
                this.appConfig.content = this.appContent;
                let configString = JSON.stringify(this.appConfig);
                window.localStorage.setItem("MapDashBoard",configString);
                let url = window.location.href;
                url = url.replace("?action=create","") + "?action=view";
                let tempwindoe = window.open();
                tempwindoe.location=url;
            },
            // 获取应用的基础配置信息
            getBaseConfig () {
                //两种状态的判断 edit / view
                if(window.MD.appState === "edit"){
                    this.getConfigUrl = window.location.href.replace("apps","web").replace("mapdashboard","mapdashboards") + ".json?t="+Date.parse(new Date());//product
                    this.$http.get(this.getConfigUrl)
                    // 请求成功处理
                        .then((res) => this.handleSuccessRequest(res))
                        // 请求失败处理
                        .catch((res)=> this.handleErrorRequest(res));
                }else {
					//首次创建，获取本地的默认config信息；
	                setTimeout(()=>{
                        this.appConfig = require("./utils/config.json");//dev
                        this.appContent = this.appConfig.content;
                        //this.compatibleConfig();
                        this.getChartUrlData(this.appContent.dataList);
	                },50)

                }
            },
            // 兼容config
            compatibleConfig(){
                let newConfig = compatibleConfig.updata(this.appConfig);
                this.appContent.baseSetting = newConfig.baseSetting;
                this.appContent.components = newConfig.components;
                this.appContent.dataList = newConfig.dataList;
                this.appConfig.content = this.appContent;
            },
            // 改变loading的状态
            changeLoadingSatae(state){
                setTimeout(()=>{
                    this.loadingState = state;
                },800)
            },
            // 获取数据列表的信息
            getChartUrlData(dataList){
                if (!dataList.length) {
                    this.changeLoadingSatae(false);
                }
                dataList.map((item,index)=>{
                    if(item.dataSource === "data"){
                        let dataParam = {
                            chartParam:{url:item.value,id:item.dataId}
                        }
                        ChartDataUtil.getData(dataParam,true);
                    }
                });
                this.changeLoadingSatae(false);
            },
            // 请求成功处理函数 res--成功响应体
            handleSuccessRequest (res) {
                this.appConfig = res.data;
                this.appContent = res.data.content;
                this.mapDashboardID = this.appConfig.id;
                if(typeof(res.data.content) === "string"){
                    this.appContent = JSON.parse(res.data.content);
                }
                this.appConfig.content = this.appContent;
                this.compatibleConfig();
                if(!this.userPowers){
                    // preview 状态
                    this.toPreview = true;
                    this.changeLoadingSatae(false);
                    return;
                }
                this.changeAppState();
            },
            // 请求失败处理函数 res--失败响应体
            handleErrorRequest (err) {
                this.$message({
                    type: 'warning',
                    message: this.$t("getConfigErrorMsg")
                });
            },
            // 根据配置信息更改应用的权限
            changeAppState(){
                let ids = [this.mapDashboardID];//[this.appConfig.id];
                let url = window.MD.hrefHead+"/web/permissions/highestpermission.json?resourceIds="+encodeURIComponent(JSON.stringify(ids))+"&resourceType=MAP_DASHBOARD";
                this.$http.get(url).then((res)=>{
                    window.MD.userState = res.data[this.mapDashboardID];
                    window.MD.userState === "DELETE" && (window.MD.userState = "READWRITE");
                    if(window.MD.userState === "READ"){
                        // 只读权限
                        this.toPreview = true;
                        this.changeLoadingSatae(false);
                    }else if(window.MD.userState === "READWRITE"){
                        // 再次进入编辑中 edit
                        this.getChartUrlData(this.appContent.dataList);
                    }
                });
            },
            // 保存配置文件
            saveConfig (state) {
                // 保存
                if(state === "save"){
                    if(window.location.href.indexOf("/apps/mapdashboard/") !== -1){
                        // 更新保存
                        this.upDataConfig();
                    }else{
                        // 首次保存
                        let params = {
                            title: this.$t("saveDashBoard"),
                            path: "common/MDInfo",
                            params:{config:this.appConfig,state:state}
                        }
                        Bus.$emit("show-popup",true,params);
                    }
                }else{
                    // 另存为
                    let params = {
                        title: this.$t("save"),
                        path: "common/MDInfo",
                        params:{config:this.appConfig,state:state}
                    }
                    Bus.$emit("show-popup",true,params);
                }
            },
            //首次创建，发送post 请求
            createdPostConfig(state){
                this.appConfig.content = this.appContent;
                this.$http.post(this.saveConfigUrl+".json",this.appConfig)
                    .then((res) => {
                        if(res.data.succeed) {
                            this.$message({
                                showClose: true,
                                message: this.$t("saveSuccess"),
                                type: 'success'
                            });
                            setTimeout(()=>{
                                let href = window.location.href;
                                if(state === "save"){
                                    window.onbeforeunload = null;
                                    window.location.href = href.replace("?action=create","")+"/"+ res.data.newResourceID;
                                }else{
                                    let url = href.slice(0,href.indexOf("/apps/mapdashboard"))+"/apps/mapdashboard/"+ res.data.newResourceID;
                                    let tempwindoe = window.open();
                                    tempwindoe.location=url;
                                }
                            },2000);
                        }
                    }).catch(()=>{
                        this.saveError();
                    });
            },
            // 更新大屏配置
            upDataConfig(){
                this.appConfig.content = this.appContent;
                let url = this.saveConfigUrl + "/" + this.mapDashboardID +".json";
                this.$http.put(url,this.appConfig)
                    .then((res) => {
                        if(res.data.succeed) {
                            this.$message({
                                showClose: true,
                                message: this.$t("updateSuccess"),
                                type: 'success'
                            })
                        }
                    }).catch(()=>{
                        this.saveError();
                });
            },
            // 更新/保存失败
            saveError(){
                this.$message({
                    showClose: true,
                    message: this.$t("saveError"),
                    type: 'error'
                })
            },
            // 背景canvas
            drawGrid(context,color, stepx, stepy){
                if(!context){return;}
                context.fillStyle = '#2F343C';
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.lineWidth = 0.5;
                context.strokeStyle = color;
                for (var i = stepx; i < context.canvas.width; i += stepx) {
                    context.beginPath();
                    context.setLineDash([2]);
                    context.moveTo(i, 0);
                    context.lineTo(i, context.canvas.height);
                    context.closePath();
                    context.stroke();
                }
                for (var j = stepy; j < context.canvas.height; j += stepy) {
                    context.beginPath();
                    context.setLineDash([3]);
                    context.moveTo(0, j);
                    context.lineTo(context.canvas.width, j);
                    context.closePath();
                    context.stroke();
                }
                context.restore();
            }
        }
    }
</script>

<style scoped>
    #app {
        width: 100%;
        height: 100%;
        min-height: 650px;
        overflow: hidden;
    }
    .app-content {
        position: relative;
        top: 0px;
        left: 0px;
        z-index: 1000;
        height: 100%;
        background-color:  #DDDDDD;
    }
    #app-content-canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 0;
    }
    #app-loading {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 99999;
        background-color: rgba(0, 0, 0, 1);
    }
    #app-loading > img {
        width: 115px;
        height: 125px;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-left: -58px;
        margin-top: -63px;
    }
    .edit-state-wrap,.preview-state-wrap {
        width: 100%;
        height: 100%;
    }
</style>
<style>
    .el-loading-mask {
        z-index: 99999;
    }
    body > .el-message {
        z-index: 99999!important;
    }
</style>

