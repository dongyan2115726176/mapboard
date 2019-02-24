<template>
    <div :class="showPanel? 'app-right active':'app-right'">
        <div class="app-right-position">
            <div class="toggle-right-wrap">
                <span
                    :class="showPanel? 'toggle-right-btn':'toggle-right-btn active'"
                    @click="toggleRightPanel"
                > 
                    {{">"}}
                </span>
            </div>
            <vue-scrollbar
                class="setting-scrollbar"
                ref="settingScrollbar"
            >
                <div class="setting-wrap">
                    <div class="setting-head f16">
                        <span class="f16">{{componentName === "DashBoard" ? this.$t("dashBoard")+this.$t("setting") : this.$t("propertySettings")}}</span>
                    </div>
                    <component
                        v-bind:is="componentName+'Setting'"
                        :param="param"
                        :baseSetting="baseSetting"
                        :dataList="dataList"
                        :appConfig="appConfig"
                    >
                    </component>
                </div>
            </vue-scrollbar>
        </div>
    </div>
</template>

<script>
import Bus from '../utils/eventBus'
import VueScrollbar from 'vue2-scrollbar' //滚动条组件
import DashBoardSetting from './right-panel/widgets/DashBoardSetting'
import TextSetting from  './right-panel/widgets/text/TextSetting'
import TimeSetting from  './right-panel/widgets/text/TimeSetting'
import TextListSetting from  './right-panel/widgets/text/TextListSetting'
import IndicatorSetting from  './right-panel/widgets/IndicatorSetting'
import ImageSetting from './right-panel/widgets/other/ImageSetting'
import BarSetting from './right-panel/widgets/charts/BarSetting';
import PieSetting from './right-panel/widgets/charts/PieSetting'
import RadarSetting from './right-panel/widgets/charts/RadarSetting'
import MapSetting from './right-panel/widgets/MapSetting';
import SceneSetting from './right-panel/widgets/SceneSetting';
export default {
    name: "SettingPanel",
    data () {
        return {
           componentName: "DashBoard",
           param:{},
           reRender:false,
           showPanel:false // 默认显示右侧面板
        }
    },
    props:{
        dataList:{
            type: Array,
            required: true
        },
        baseSetting:{
            type: Object,
            required: true
        },
        appConfig:{
            type:Object,
            required:true
        }
    },
    components:{
        VueScrollbar,
        DashBoardSetting,
        TextSetting,
        TimeSetting,
        TextListSetting,
        IndicatorSetting,
        ImageSetting,
        BarSetting,
        PieSetting,
        RadarSetting,
        MapSetting,
        SceneSetting
    },
    created () {
        // 在DashBoard 组件中$emit定义 切换对应的配置组件
        Bus.$on("toggle-settingPanel",(param) => {
            if(!param && this.componentName === "DashBoard"){
                return;
            }
            this.reRender = true;
            this.$nextTick(()=>{
                this.reRender = false;
                this.componentName = param?param.type:"DashBoard"
                this.param = param;
            })
        });
        // 添加组价 打开右侧面板
        Bus.$on("addWidget-settingPanel",(state)=>{
            this.showPanel = state;
            Bus.$emit("setting-container",this.showPanel)
        })
    },
    methods:{
        toggleRightPanel(){
            this.showPanel = !this.showPanel;
            Bus.$emit("setting-container",this.showPanel)
        }
    }
}
</script>

<style scoped>
    .app-right {
        position: absolute;
        top: 0px;
        right: -290px;
        z-index: 1100;
        width: 290px;
        height: 100%;
        background-color: #1B1F24;
        color :#A4AFB9;
        transition: right 0.4s ease 0s;
    }
    .app-right.active {
        right: 0px;
    }
    .app-right-position {
        width: 100%;
        height: 100%;
        position: relative;
        top: 0px;
        left: 0px;
    }
    .toggle-right-wrap {
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0px;
        left: -10px;
    }
    .toggle-right-wrap > .toggle-right-btn {
        width: 11px;
        height: 156px;
        position: absolute;
        top:calc(50% - 156px);
        line-height: 150px;
        text-align: center;
        border-radius: 10px 0 0 10px;
        background-color: #0E1013;
        color: #BDCBD5;
        cursor: pointer;
        font-size: 14px;
    }
    .toggle-right-wrap > .toggle-right-btn.active {
        display: block;
    }
    .setting-scrollbar {
        float: left;
        max-height: calc(100% - 50px);
        background-color: #1B1F24;
        color :#BDCBD5;
    }
    .setting-wrap {
        height: 100%;
    }
    .setting-head {
        border-bottom:1px solid;
        margin-bottom: 23px;
        padding-left: 20px;
        line-height: 60px;
        border-color: #272F3A;
    }
</style>
<style>
    .vue-scrollbar__scrollbar-vertical {
        width: 5px;
    }
    .vue-scrollbar__scrollbar-vertical .scrollbar {
        width: 5px;
        border-radius: 5px;
    }
</style>

