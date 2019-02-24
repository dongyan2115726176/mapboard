<template>
    <div 
        id="aside-container"
        :class="showAsideTabs ? 'active':''"
        @mouseleave.stop="toggleAsideTabs(false)"
        @mouseover.stop="toggleAsideTabs(true)"
    >
        <div class="aside-hidden-wrap">
            <el-tabs
                tab-position="left"
                class="aside-el-tabs"
                @tab-click="tabClick"
                v-model="activePanel"
            >
                <el-tab-pane
                    v-for="(item,index) in tabsOption"
                    :key="index"
                >
                    <span slot="label" class="aside-table-wrap">
                        <i :class="item.iconName"></i>
                        <span>{{$t(item.tabName)}}</span>
                    </span>
                    <TabPanel
                        :item="item"
                        :widget-list="widgetList"
                        :data-list="dataList"
                        :base-setting="baseSetting"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import TabPanel from './left-panel/TabPanel'
    import Bus from "../utils/eventBus"
    export default {
        name:"AsideContainer",
        data () {
            return {
                activePanel:"0",
                tabsOption:[
                    {iconName:"md-icon-dash-board",tabName:"dashBoard",component:"DashBoard"},
                    {iconName:"md-icon-map",tabName:"map",component:"Map"},
                    {iconName:"md-icon-scene",tabName:"scene",component:"Scene"},
                    {iconName:"md-icon-data",tabName:"data",component:"Data"},
                    {iconName:"md-icon-chart",tabName:"chart",component:"Chart"},
                    {iconName:"md-icon-indicator",tabName:"indicator",component:"Indicator"},
                    {iconName:"md-icon-text",tabName:"text",component:"Text"},
                    {iconName:"md-icon-other",tabName:"other",component:"Other"}
                ],
                showAsideTabs:false // 显示左侧面板

            };
        },
        props: {
            widgetList: {
                type: Array,
                required: true
            },
            dataList:{
                type: Array,
                required: true
            },
            baseSetting:{
                type: Object,
                required: true
            }
        },
        created(){
            // 移动组件时,左侧切换回大屏列表
            Bus.$on("select-change-tab",(component)=>{
                if(this.activePanel !== "0"){
                    this.activePanel = "0";
                }
            })
        },
        components: {
            TabPanel
        },
        methods: {
            toggleAsideTabs(state){
                if(this.showAsideTabs != state){
                    this.showAsideTabs = state;
                }
            },
            // 切换到大屏的时候 取消所有高亮 右侧切换到大屏设置
            tabClick(event){
                if(event.index === "0"){
                    Bus.$emit("toggle-settingPanel","");
                }
            }
        }
    }

</script>
<style scoped>
    #aside-container {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 2000;
        height: 100%;
        pointer-events: all;
        color: #BDC9D4;
    }
    .aside-hidden-wrap {
        position: relative;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
    .aside-hidden-wrap.active {
        width: 100%;
    }
    .aside-el-tabs {
        width: 100%;
        height: 100%;
    }
    .aside-table-wrap > i {
        display: block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 45px;
        font-size: 18px;
    }
</style>
<style>
    .aside-el-tabs > .el-tabs__header.is-left {
        position: absolute;
        left:0px;
        top:0px;
        z-index: 1000;
        background: #2C2E36;
    }
    .el-tabs--left .el-tabs__content {
        position: absolute;
        left: -260px;
        top: 0px;
        z-index: 999;
        width: 260px;
        height: 100%;
        padding: 20px 0 0 20px;
        background-color: #1D1F24;
        transition:left 0.4s ease 0s;
        overflow: hidden;
    }
    .el-tabs--left .el-tabs__content > .el-tab-pane {
        height: 100%;
    }
    .aside-table-wrap {
        margin-bottom: 20px;
    }
    .el-tabs--left .el-tabs__active-bar.is-left {
        left: 0px;
    }
    .el-tabs--left .el-tabs__nav-wrap.is-left {
        margin-right: 0;
    }
    .el-tabs__nav-wrap.is-left::after {
        display:none;
    }
    .el-tabs__nav-wrap.is-left > .el-tabs__nav-scroll {
        padding-top: 30px;
    }
    .el-tabs--left .el-tabs__active-bar.is-left {
        width: 4px;
        background-color: #006FD3;
        transition:none;
    }
    .el-tabs__item.is-left {
        color: #BDC9D4;
    }
    .el-tabs__item.is-left:hover {
        color: #13A2FC;
    }
    .el-tabs__item.is-left.is-active{
        color: #13A2FC;
        background-color: #1D1F24;
    }
</style>
<style>
    #English #aside-container.active {
        width: 332px;
    }
	#English .aside-table-wrap > span {
		display: block;
		width: 100%;
		text-align: center;
		font-size: 12px;
		line-height: 12px;
		white-space: pre-wrap;
		word-break: break-all;
	}
    #English .el-tabs--left .el-tabs__header.is-left {
        width: 72px;
        margin-right: 0px;
    }
    #English .el-tabs__item.is-left {
        width: 76px;
        height: 70px;
        padding: 0;
    }
    #English #aside-container.active .el-tabs__content {
        left: 72px;
    } 
    #Chinese #aside-container.active .el-tabs__content {
        left: 46px;
    } 
    #Chinese #aside-container.active {
        width: 306px;
    }
    #Chinese .el-tabs__item.is-left {
        width: 46px;
        height: 70px;
        padding: 0;
    }
    #Chinese .el-tabs--left .el-tabs__header.is-left {
        width: 46px;
        margin-right: 0px;
    }
	#Chinese .aside-table-wrap > span {
		display: block;
		width: 100%;
		text-align: center;
		font-size: 14px;
		line-height: 14px;
	}
</style>
