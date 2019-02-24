<template>
    <div id="select-template">
        <div class="select-template-wrap">
            <div
                class="template-item" 
                v-for="(item,index) in templateList"
                :key="index"
                :class="activeIndex === index ? 'active':''"
            >
                <img :src="item.img" alt="" @click.stop="selectTemplate(index)">
                <p class="f14">{{item.text}}</p>
            </div>
        </div>
        <el-button
            type="primary"
            size="small"
            class="select-template-btn"
            @click="onGetTemplate"
        >
            {{$t("confirm")}}
        </el-button>
    </div>
</template>

<script>
import Bus from '../../utils/eventBus'
import TravelImg from '../../../src/assets/images/template/TravelMonitoring.jpg'
import ProjectImg from '../../../src/assets/images/template/ProjectMonitoring.jpg'
import BusinessImg from '../../../src/assets/images/template/BusinessRevenue.jpg'
import TravelMonitoring from '../../utils/template/TravelMonitoring.json'
import ProjectMonitoring from '../../utils/template/ProjectMonitoring.json'
import BusinessRevenue from '../../utils/template/BusinessRevenue.json'
export default {
    name: 'Template',
    data(){
        return {
            template: ProjectMonitoring,
            activeIndex:0,
            templateList:[
                {text:"项目监控大屏模版",img:ProjectImg,template:ProjectMonitoring},
                {text:"城市出行监控模版",img:TravelImg,template:TravelMonitoring},
                {text:"企业业绩大屏",img:BusinessImg,template:BusinessRevenue}
            ]
        }
    },
    methods: {
        // 选择模版
        selectTemplate(index){
            this.activeIndex = index;
            this.template = this.templateList[index].template;
        },
        // 确定模版
        onGetTemplate(){
            //通知APP.vue 刷新内容
            Bus.$emit("update-appConfig",this.template);
            //通知piblicPop.vue 关闭弹窗
            Bus.$emit("show-popup",false);
        }
    }
}
</script>

<style scoped>
    #select-template {
        width: 925px;
        height: 450px;
        position: relative;
        top: 0px;
        left: 0px;
    }
    .select-template-wrap {
	    margin-left: 10px;
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: flex-start;
    }
    .template-item {
        width: 288px;
        height: 180px;
        text-align: center;
    }
    .template-item:nth-of-type(2n){
        margin: 0 20px;
    }
    .template-item > img {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 162px;
        cursor: pointer;
        box-sizing: border-box;
    }
    .template-item.active > img {
        border: 1px solid #13A2FC;
    }
    .template-item > img:hover {
        border: 1px solid #13A2FC;
    }
    .template-item > p {
        padding-top: 14px;
    }
    .select-template-btn {
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 64px;
        height: 28px;
    }
</style>

