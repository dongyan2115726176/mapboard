<template>
    <div id="data-flow">
        <div class="flex-row-between">
            <span class="list-title">
                {{$t("dataFlowUrl")}}：
                <i class="md-icon-tips" :title="$t('dataFlowTitle')"></i>
            </span>
            <el-input
                v-model="fieldOption.url"
                size="small"
                placeholder="ws://{ip}:{port}/iserver/services/dataflow2/dataflow"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="flex-row-between">
            <span class="list-title">{{$t("mapUrl")}}：</span>
            <el-input
                v-model="fieldOption.mapUrl"
                size="small"
                :placeholder="$t('iserverMapUrl')"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="flex-row-between">
            <span class="list-title">{{$t("epsgObject")}}：
                <i class="md-icon-tips" :title="$t('epsgTips')"></i>
            </span>
            <el-select
                v-model="fieldOption.epsg"
                :placeholder="$t('choose')"
                size="small"
                class="list-size"
            >
                <el-option
                    v-for="item in epsgOption"
                    :key="item.type"
                    :label="item.type"
                    :value="item.type"
                >
                </el-option>
            </el-select>
        </div>
        <div class="flex-row-between">
            <span class="list-title">{{$t("idField")}}：</span>
            <el-input
                v-model="fieldOption.idField"
                size="small"
                :placeholder="$t('fillIdField')"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="flex-row-between">
            <span class="list-title">{{$t("rotateDeg")}}：</span>
            <el-input
                v-model="fieldOption.deg"
                size="small"
                :placeholder="$t('rotateDegPlaceholder')"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="flex-row-between">
            <span class="list-title">{{$t("iconChoose")}}：</span>
            <div class="list-size">
                <div class="icon-img-wrap" @click="showIconElDialog=true">
                    <img :src="imgSrc" alt="">
                </div>
            </div>
        </div>
        <el-dialog 
            :title="$t('iconChoose')" 
            :visible.sync="showIconElDialog"
            :modal-append-to-body="false"
        >
            <div class="data-flow-icons-wrap">
                <span 
                    v-for="(item,index) in iconsParams"
                    :key="index"
                    @click="onSelectIcon(item)"
                >
                    <img :src="imgHeadUrl + item" alt="">
                </span>
            </div>
        </el-dialog>
        <div class="flex-row-between">
            <i></i>
            <el-button
                type="primary"
                size="small"
                class="real-data-btn"
                @click="onGetRealData"
            >
                {{$t("confirm")}}
            </el-button>
        </div>
    </div>
</template>

<script>
import Bus from "../../../utils/eventBus"
export default {
    name: "LiveDataForDataflow",
    data () {
        return {
            fieldOption:{
                mapUrl:"",
                url:"",
                epsg:3857,
                idField:"",
                deg:""
            },
            epsgOption:[
                {type:3857},
                {type:4326}
            ],
            imgSrc:"../../../../static/images/plane.png",
            imgHeadUrl:"../../../../static/images/",
            showIconElDialog:false,
            iconsParams:["round.png","bicycle.png","bus.png","car.png","ship.png","plane.png"], //图标名字
        }
    },
    props:{
        baseSetting:{
            type:Object,
            required:true
        }
    },
    created(){
        let index = window.location.href.indexOf("/apps/mapdashboard");
        if(index > -1){
            this.imgHeadUrl = window.MD.hrefHead+"/apps/static/mapdashboard/images/";
            this.imgSrc = this.imgHeadUrl + "plane.png";
        }
    },
    methods:{
        // 获取图标
        onSelectIcon(iconName){
            this.imgSrc = this.imgHeadUrl + iconName;
            this.showIconElDialog = false;
        },
        // 检查字段是否为空
        ckeckParams(){
            let check = true;
            for(let key in this.fieldOption){
                if(key !== "deg"){
                    if(!this.fieldOption[key]){
                        check = false;
                        this.$message({
                            type: 'warning',
                            message: this.$t("emptyDataFlowParams")
                        })
                        break;
                    }
                }
            }
            return check;
        },
        // 点击确定按钮触发
        onGetRealData(){
            let check = this.ckeckParams();
            if(!check){return;}
            this.checkDataFlowUrl();
        },
        // 检查数据流地址
        checkDataFlowUrl(){
            let url = this.fieldOption.url;
            let currentWebSocket = this.connect(url+"/subscribe");
            if(currentWebSocket){
                currentWebSocket.onerror =(error)=>{
                    this.$message({
                        type: 'warning',
                        message: this.$t("currentWebSocketError")
                    })
                }
                currentWebSocket.onmessage = (evt)=> {
                    currentWebSocket.close();
                    this.addDataFlowToApp();
                }
            }
        },
        connect(url) {
            if ("WebSocket" in window) {
                return new WebSocket(url);
            } else if("MozWebSocket" in window) {
                return new MozWebSocket(url);
            }
        },
        // 添加到配置文件中
        addDataFlowToApp(){
            let bodyWidth = this.baseSetting.width;
            let bodyHeight = this.baseSetting.height;
            let style = {
                height: bodyHeight + "px",
                width: bodyWidth + "px",
                left: "0px",
                top: "0px"
            }
            this.fieldOption.iconUrl = this.imgSrc;
            let mapParam = {
                type: "Map",
                nls:"map",
                icon:"md-icon-map-widget",
                dataSource:"dataFlow",
	            title: this.$t("dataFlow"),
                fieldOption:this.fieldOption,
                id: new Date().getTime(),
                center: [0,0],
                zoom: 0,
                fullScreen:true,
                mapEvents:true, // 默认开启地图的鼠标事件
                scaleLine: false, // 比例尺
                overviewMap: false, // 鹰眼
                style
            }
            // 在App 组件中$on调用 为应用添加默认图表组件
            Bus.$emit("update-components",mapParam);
        }
    }
}
</script>

<style scoped>
    #data-flow {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
    }
    .flex-row-between {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .list-title {
        display: block;
        line-height: 36px;
    }
    .list-size {
        width: 450px;
    }
    .real-data-btn {
        float: right!important;
        width: 64px;
        height: 28px;
    }
    .icon-img-wrap {
        width: 28px;
        height: 28px;
        cursor: pointer;
    }
    .icon-img-wrap:hover{
        border: 1px dotted #ffffff;
    }
    .icon-img-wrap > img {
        display: block;
        width: 100%;
        height: 100%;
    }
    .data-flow-icons-wrap {
        height: 60px;
        padding-top: 15px;
        overflow: hidden;
    }
    .data-flow-icons-wrap > span {
        display: block;
        box-sizing: border-box;
        float: left;
        margin-left: 10px;
        width: 40px;
        height: 40px;
        padding: 5px;
        cursor: pointer;
    }
    .data-flow-icons-wrap > span:hover {
        border:1px dotted #ffffff;
    }
    .data-flow-icons-wrap > span > img {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .data-flow-text {
        text-align: center;
        margin-bottom: 10px;
        color:gray;
    }
</style>


