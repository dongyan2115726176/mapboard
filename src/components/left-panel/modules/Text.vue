<template>
    <div id="module-text">
        <span class="f16">{{$t("selectTextType")}}：</span>
        <i class="split-line"></i>
        <div class="text-content">
            <div
                v-for="(item,index) in textOption"
                :key="index"
                class="text-list"
                @click="selectOther(item.value)"
                @dragstart="ondragstart($event,item.value)"
                :draggable="true"
            >
                <div class="text-list-img">
                    <img :src="item.img" alt="">
                </div>
                <span class="text-list-title">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from '../../../utils/eventBus';
    import rollText from '../../../assets/images/rollText.png';
    import timeWidget from '../../../assets/images/timeWidget.png';
    //文本列表图片
    // import textListWidget from '../../../assets/images/textListWidget.png';
    export default {
        name:"Texts",
        data () {
            return {
                textListColor:'#3eb0e7',//文本列表字体颜色
                textColor:"#3eb0e7", // 默认字体颜色
                textOption: [ // 选择指标列表
                    {img:rollText,name:this.$t("commonChar"),value:"text"},
                    {img:timeWidget,name:this.$t("time"),value:"time"},
                    {img:timeWidget,name:this.$t("textList"),value:"textList"},
                ]
            }
        },
        created(){
            // 接收大屏的主题样式 来设置颜色系列
            Bus.$on("theme-change",(themePlan)=>{
                let {text} = themePlan;
                this.textColor = text;
                let {textList} = themePlan;
                this.textListColor = textList.body;//接受大屏的文本列表的文本颜色
            })
        },
        methods: {
            ondragstart(e,value){
                if(value=='text'){
                    this.selectText(value,true)
                }else if(value=='time'){
                    this.initTimeParams(true)
                }else{
                    this.selectTextList(true)
                }
            },
            // 选择其他组件的哪一项
            selectOther(name) {
                switch (name){
                    case "text":
                    this.selectText(this.$t("commonChar"));
                    break;
                    case "time":
                    this.initTimeParams();
                    break;
                    case "textList":
                    this.selectTextList();
                    break;
                }
            },
            selectText (name,isDrag) {
                let textParam ={
                    type: "Text",
                    nls:"commonChar",
                    icon:"md-icon-title",
                    title: name,
                    id: new Date().getTime(),
                    fontSize: "18px",
                    lineHeight:"40px",
                    fontFamily:"Microsoft YaHei",
                    fontWeight:"normal",
                    textAlign:"center",
                    textIndent:"0px",
                    color: this.textColor,
                    style: {
                        top: "400px",
                        left: "400px",
                        width: "200px",
                        height: "100px"
                    }
                }
                if(isDrag){
                    Bus.$emit("widgetDrag-mid",textParam);
                    return;
                }
                // 在App 组件中$on调用 为应用添加默认图表组件
                Bus.$emit("update-components",textParam);
            },
            // 初始化自定义时间组件
            initTimeParams(isDrag){
                let imageParam ={
                    type: "Time",
                    nls: "time",
                    title:this.$t("realTime"),
                    icon: "md-icon-time",
                    id: new Date().getTime(),
                    param:{
                        fontStyle:{
                            fontSize: "18px",
                            fontFamily:"Microsoft YaHei",
                            fontWeight:"normal",
                            color: this.textColor
                        },
                        timeType:"date"
                    },
                    style: {
                        top: "400px",
                        left: "500px",
                        width: "150px",
                        height: "85px"
                    }
                }
                if(isDrag){
                    Bus.$emit("widgetDrag-mid",imageParam);
                    return;
                }
                // 在App 组件中$on调用 为应用添加默认图表组件
                Bus.$emit("update-components",imageParam);
            },
            //初始化自定义文本组件
            selectTextList(isDrag){
                let textListParam = {
                    type: "TextList",
                    nls:"textList",
                    icon:"md-icon-time",
                    id: new Date().getTime(),
                    //setting
                    //表头
                    headTitle:[],
                    content:[],
                    fontSize: "24px",
                    fontColor: this.textListColor,
                    dataSource:"示范数据",
                    textListParam:{
                        dataColumn:[],//数据列
                        dataRows:5,//展示行数
                        frequency:2, // 刷新时间
                        id:'textListDemo',    
                        dataName: this.$t("demonstrationData"),
                        refreshMethod:'逐条滚动'
                    },          
                    style:{
                        top: "400px",
                        left:"500px",
                        width:"1380px",
                        height:"500px"  
                    }
                }
                 if(isDrag){
                    Bus.$emit("widgetDrag-mid",textListParam);
                    return;
                }
                // 在App 组件中$on调用 为应用添加默认文本列表组件
                Bus.$emit("update-components",textListParam);
            }
        }
    }
</script>
<style scoped>
    #module-text {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        padding-right: 20px;
        padding-top: 19px;
    }
    .text-content {
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .text-list {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .text-list-icon {
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        font-size: 80px;
    }
    .text-list-title {
        text-align: center;
        font-size:13px;
    }
    .text-list-img {
        width: 96px;
        height: 70px;
        margin-bottom: 10px;
        background-color:#292A2F;
    }
    .text-list-img > img {
        display: block;
        width: 94px;
        height: 68px;
    }
    .text-list-img:hover{
        border: 1px solid #0295dc;
    }
</style>

