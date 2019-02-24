<template>
    <div id="map-setting">
        <div class="map-zoom">
            <div class="costum-input">
                <label for="zoom">{{$t("zoomLevel")}}：</label>
                <el-input
                    id="zoom"
                    class="mini-input"
                    v-model="mapInitParam.zoom"
                    @input="setMapParam"
                />
            </div>
        </div>
        <span class="x-setting-line"></span>
        <div class="map-center">
            <p class="costum-input">{{$t("centralSetting")}}</p>
            <div class="costum-input">
                <label for="lng">{{$t("longitude")}}：</label>
                <el-input 
                    id="lng" 
                    class="list-size"
                    v-model="mapInitParam.lng" 
                    @input="setMapParam"
                />
            </div>
            <div class="costum-input">
                <label for="lat">{{$t("latitude")}}：</label>
                <el-input 
                    id="lat" 
                    class="list-size"
                    v-model="mapInitParam.lat" 
                    @input="setMapParam"
                />
            </div>
        </div>
        <span class="x-setting-line"></span>
        <p>{{$t("mapWidget")}}：</p>
        <div class="map-controls">
            <el-checkbox 
                v-model="mapInitParam.scaleLine"
                @change="setMapParam"
            >
                {{$t("plottingScale")}}
            </el-checkbox>
            <el-checkbox 
                v-model="mapInitParam.overviewMap"
                @change="setMapParam"
            >
                {{$t("overViewMap")}}
            </el-checkbox>
        </div>
        <span class="x-setting-line"></span>
        <div class="map-radio">
            <span class="f14">{{$t("model")}}：</span>
            <el-radio-group
                class="map-radio-group"
                v-model="mapInitParam.fullScreen"
                @change="mapFullScreen"
                size="small"
            >
                <el-radio-button :label="true">{{$t("mapFullScreen")}}</el-radio-button>
                <el-radio-button :label="false">{{$t("mapInitState")}}</el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
import Bus from "../../../utils/eventBus"
import CommonUtil from "../../../utils/commonUtil.js"
export default {
    name: "mapSetting",
    data () {
        return {
        }
    },
    props: {
        param: {
            type:Object,
            required:true
        },
        baseSetting:{
            type:Object,
            required:true
        }
    },
    computed: {
        // 初始化map配置信息
        mapInitParam () {
            let {zoom,center:[lng,lat],style:{width,height},scaleLine,overviewMap,fullScreen} = this.param;
            width = parseInt(width);
            height = parseInt(height);
            return {zoom,lat,lng,width,height,scaleLine,overviewMap,fullScreen};
        }
    },
    methods: {
        // 修改地图配置 组合当前最新配置信息
        mapConfigParam () {
            let param = this.param;
            let mapInitParam = this.mapInitParam;
            param.zoom = mapInitParam.zoom;
            param.scaleLine = mapInitParam.scaleLine;
            param.overviewMap = mapInitParam.overviewMap;
            param.center = [mapInitParam.lng,mapInitParam.lat];
            Bus.$emit("setting-mapWidget",param);
            return param;
        },
        setMapParam () {
            return this.mapConfigParam();
        },
        // 地图全屏
        mapFullScreen(){
            CommonUtil.fullScreenSetting(this.param,this.baseSetting,this.effectPointActive=false)
        }
    }
}
</script>

<style scoped>
    #map-setting {
        padding-left: 20px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
    }
    .costum-input {
        margin-bottom:10px ;
    }
    .costum-input>label {
        display: inline-block;
        width: 70px;
        text-align: left;
    }
    #lng,#lat {
        width: 168px;
        height: 28px;
    }
    .map-controls {
        margin-top: 15px;
    }
    .list-size {
        width: 163px;
        height: 28px;
    }
    .map-radio > .map-radio-group {
        margin-left: 35px;
    }
    .map-control > p {
        margin-bottom: 10px;
    }
    .mini-input {
        width: 64px;
        height: 28px;
    }
</style>
