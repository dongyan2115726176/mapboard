<template>
    <div id="scene-setting">
        <div class="flex-row">
            <span class="f14">{{$t("scanEffect")}}：</span>
            <el-select
                class="scene-setting-input"
                v-model="sceneInitParam.scanEffect.type"
                @change="setSceneParam"
            >
                <el-option
                    v-for="item in scanEffect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    size="mini"
                >
                </el-option>
            </el-select>
        </div>
	    <div v-show="sceneInitParam.scanEffect.status">
			<div class="flex-row">
			    <span class="f14">{{$t("period")}}：</span>
			    <el-input
                    id="period"
                    class="scene-setting-input"
                    size="mini"
                    v-model="sceneInitParam.scanEffect._period"
                    @input="setSceneParam"
			    >
                </el-input>
		    </div>
		    <div class="flex-row">
			    <span class="f14">{{$t("effectSpeed")}}：</span>
			    <el-input
                    id="speed"
                    class="scene-setting-input"
                    v-model="sceneInitParam.scanEffect.speed"
                    @input="setSceneParam"
			    >
                </el-input>
		    </div>
		    <el-button
                class="scene-setting-btn"
                :type="effectPointActive?'primary':''"
                @click="selectScanEffectPoint"
		    >
			    {{$t("selectPoint")}}
		    </el-button>
	    </div>
	    <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("model")}}：</span>
            <el-radio-group 
                v-model="sceneInitParam.fullScreen"
                @change="sceneFullScreen"
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
    name: "sceneSetting",
    data () {
        return {
            scanEffectStyle: "noScan",
            scanEffect: [
	            {value:"noScan",label:this.$t("closed")},
	            {value: "circle",label: this.$t("circleEffect")},
                {value: "line",label: this.$t("lineEffect")}
            ],
            effectPointActive:false
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
    created(){
        // 取消场景选择中心点高亮
        Bus.$on("close-effect-point",(state)=>{
            this.effectPointActive = false;
        })
    },
    computed: {
        // 初始化map配置信息
        sceneInitParam () {
            let {style:{width,height},fullScreen,scanEffect} = this.param;
            width = parseInt(width);
            height = parseInt(height);
            return {width,height,fullScreen,scanEffect};
        }
    },
    methods: {
        // 修改场景配置 组合当前最新配置信息
        sceneConfigParam () {
            let param = this.param;
            let {scanEffect} = this.sceneInitParam;
            param.scanEffect = scanEffect;
            Bus.$emit("setting-sceneWidget",param);
            return param;
        },
        setSceneParam () {
            return this.sceneConfigParam();
        },
        /**
         * 选择扫描中心点
         */
        selectScanEffectPoint() {
            this.effectPointActive = true;
            Bus.$emit("sceneSetting-selectPoint");
        },
        // 组件全屏
        sceneFullScreen(){
            CommonUtil.fullScreenSetting(this.param,this.baseSetting,this.effectPointActive=true)
        }
    }
}
</script>

<style scoped>
    #scene-setting {
        padding: 0 20px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        margin-bottom: 23px;
    }
    .flex-row > .f14 {
        line-height: 28px;
    }
    .scene-setting-input {
        width: 164px;
        height: 28px;
    }
</style>
