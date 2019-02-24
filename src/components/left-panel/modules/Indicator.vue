<template>
    <div id="module-indicator">
        <p class="f16">{{$t("selectIndicator")}}：</p>
        <i class="split-line"></i>
        <div class="indicator-content">
            <div
                v-for="(item,index) in indicatorOption"
                :key="index"
                class="indicator-list"
                @dragstart="onDragStart"
                @click="selectIndicator(false)"
                :draggable="true"
            >
                <div class="indicator-list-img">
                    <img :src="item.img" />
                </div>
                <span class="indicator-list-title f13">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from "../../../utils/eventBus"
    /*黑色版本图标*/
    import bStaticIndicator from "../../../assets/images/bStaticIndicator.png"
    export default {
        name:"Indicator",
        data () {
            return {
                indicatorColor:"#3eb0e7", // 默认颜色
                titleUnitColor:"#353535", // 标题和指标默认颜色
                indicatorOption: [
                    {img:bStaticIndicator,name:this.$t("statisticsIndicator")}
                ]
            }
        },
        created(){
            // 接收大屏的主题样式 来设置颜色系列
            Bus.$on("theme-change",(themePlan)=>{
                let {indicator} = themePlan;
                this.indicatorColor = indicator.body;
                this.titleUnitColor = indicator.title;
            })
        },
        methods: {
            // 拖拽开始事件
            onDragStart(e){
                this.selectIndicator(true);
            },
            // 创建统计字段
            selectIndicator(isDrag){
                let indicatorParam = {
                    type: "Indicator",
                    dataSource:"server",
                    nls:"statisticsIndicator",
                    icon:"md-icon-indicator",
                    id: new Date().getTime(),
                    title: this.$t("indicatorTitle"),
                    num:this.$t("indicatorNum"),
                    unit: this.$t("unit"),
                    fontSize: "24px",
                    fontColor: this.indicatorColor,
                    titleColor: this.titleUnitColor,
                    agent:true,
                    url:"",
                    field:[],
                    frequency:60,
                    style:{
                        top: "400px",
                        left:"500px",
                        width:"300px",
                        height:"100px"
                    }
                }
                 if(isDrag){
                    Bus.$emit("widgetDrag-mid",indicatorParam);
                    return;
                }
                // 在App 组件中$on调用 为应用添加默认图表组件
                Bus.$emit("update-components",indicatorParam);
            }
        }
    }
</script>
<style scoped>
    #module-indicator {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        padding-right: 20px;
        padding-top: 19px;
    }
    .indicator-content {
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .indicator-list {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        cursor: pointer;
    }
    .indicator-list-img {
        width: 96px;
        height: 70px;
        margin-bottom: 10px;
    }
    .indicator-list-img > img {
        display: block;
        width: 96px;
        height: 70px;
    }
    .indicator-list-img > img:hover{
        border: 1px solid #0295dc;
    }
    .indicator-list-title {
        text-align: center;
    }
</style>

