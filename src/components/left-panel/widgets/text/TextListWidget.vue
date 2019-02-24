<template>
    <div
        class="textList-widget"
    >
        <div class="header">
            <div class="headerContent">
                <p
                    v-for="(item,index) in textListParams.headTitle"
                    :key="index"
                    style="color:#333;font-size:20px;background:skyblue"
                >{{item}}</p>
            </div>
        </div>
        <div class="animate" :style="textListParams.numStyle">
            <div class="bodyContent" :style="textListParams.tableStyle">
                <div
                    v-for="(item,index) in animateContent"
                    :key="index"
                    :style="textListParams.rowStyle"
                >
                    <p
                        v-for="(items,index2) in item"
                        :key="index2"
                        :style="textListParams.LineHeight"
                    >{{items}}
                    </p>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
import Bus from '../../../../utils/eventBus'
import { setInterval, setTimeout, clearInterval, clearTimeout } from 'timers';
import ChartDataUtil from "../../../../utils/chartDataUtil";
import CommonUtil from "../../../../utils/commonUtil";
export default {
    name: "TextListWidget",
    data () {
        return {
            animateContent:[],
            saveTimeout:{
                startInter:null,
                animateTimeout:null
            },
            topPosition:0
        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    created(){
        if(this.param.dataSource === "示范数据"){
            this.param.headTitle = [];
            this.param.content = [];
        }
        
         // 接收大屏的主题样式 来设置颜色系列
        Bus.$on("theme-change",(themePlan,isInit)=>{
            if(isInit){ return;}
            let {indicator} = themePlan;
            this.param.fontColor = indicator.body;
            this.param.titleColor = indicator.title;
        })
    },
    computed:{
        textListParams () {
            let {fontSize,fontColor,dataSource,headTitle,content,style,textListParam:{dataRows}} = this.param;
            let numStyle = {fontSize:fontSize,color:fontColor,height:style.height.substr(0,style.height.length-2)-65+"px"};
            let tableStyle = {width:style.width,top:-this.topPosition+"px"}
            // console.log(tableStyle)
            let rowStyle = numStyle.height;
            rowStyle = rowStyle.substr(0,rowStyle.length-2)
            rowStyle = rowStyle/dataRows
            let LineHeight = {lineHeight:rowStyle+"px"}
            rowStyle = {height:rowStyle+"px"};
            this.animateContent = content.concat();
            if(this.param.textListParam.refreshMethod=='逐条滚动'){
                if(content.length > 2){
                    this.showAnimate();
                }
            }else{
                
            }
            return {numStyle,tableStyle,rowStyle,LineHeight,dataSource,headTitle,content,dataRows};
        }
    },
    destroyed(){
        this.clearTime();
    },
    methods:{
        clearTime(){
            clearInterval(this.saveTimeout.startInter);
            clearInterval(this.saveTimeout.animateSettime);
        },
        showAnimate(){
            this.clearTime();
            let num = 0;
            this.saveTimeout.startInter = setInterval(()=>{
                this.saveTimeout.animateTimeout = setTimeout(()=>{
                    let head = this.animateContent[0];
                    this.animateContent.push(head);
                    
                    this.animateContent.shift();
                    num ++;
                    console.log(num)
                    this.topPosition = num*this.textListParams.rowStyle.height.substr(0,this.textListParams.rowStyle.height.length-2);
                    console.log(this.topPosition)

                },300);
            },this.param.textListParam.frequency * 1000);
        },
    }
}
</script>

<style scoped>
    .textList-widget {
       width: 100%;
       height: 100%;
    }
    .header{
        height: 65px;
        line-height: 65px;
    }
    .animate{
        background: #fff;
        overflow: hidden;
        position: relative;
    }
    .bodyContent{
        position: absolute; 
    }
    .bodyContent div{
        width: 100%;
        height: 5vh;
        display: flex;
    }
    .bodyContent div p{
        border: 1px solid;
        text-align: center;
        flex: 1;
    }
    .headerContent{
        display: flex;
    }
    .headerContent p{
        text-align: center;
        border: 1px solid;
        flex: 1;
        height: 65px;
        display: block;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
