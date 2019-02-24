<template>
    <div
        class="indicator-widget"
    >
        <div class="indicator-body">
            <div class="indicator-head">
                <span class="indicator-title" :style="unit_titleStyle">{{param.title}}</span>
            </div>
            <div class="indicator-content">
                <span
                    :id="'indicator-num'+index"
                    class="indicator-num"
                    :style="numStyle"
                >
                    {{numberSymbol}}
                </span>
                <span class="indicator-nuit" :style="unit_titleStyle">{{param.unit}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '../../../utils/eventBus';
export default {
    name: "IndicatorWidget",
    data () {
        return {
            index:0,// 索引
            warpStyle:{},
            numStyle:"", // 数字样式
            unit_titleStyle:"", //单位和标题样式
            saveTimeout:"",
            numberSymbol:"",
        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    created(){
        this.creatParams();
         // 接收大屏的主题样式 来设置颜色系列
        Bus.$on("theme-change",(themePlan,isInit)=>{
            if(isInit){ return;}
            let {indicator} = themePlan;
            this.param.fontColor = indicator.body;
            this.param.titleColor = indicator.title;
        })
    },
    watch:{
        param:{
            handler(val){
                this.creatParams();
            },
            deep:true
        }
    },
    methods:{
        //给数字添加千位符并对.N个0的小数取整
        addNumberSymbol(num){
            num = num.toString();
            let index = num.lastIndexOf('.');
            let integer = num,
                decimal = '';
            if(index > 0){
                integer = num.substring(0,index);
                decimal = num.substring(index);
            }
            integer = integer.replace(/(\d{1,3})(?=(\d{3})+$)/g,"$1,");
            num = integer + decimal; //整数 + .小数
            if(/\.0+$/.test(decimal)){//判断 小数 是否为.N个0的形式
                num = integer;
            }
            return num;
        },
        // 判断是纯数字
        isNumber(str){
           return /^\d+$/.test(str);
        },
        // 参数组装
        creatParams(){
            this.warpStyle = this.param.style;
            this.numberSymbol = this.param.num;
            if(this.isNumber(this.param.num)){
                this.numberSymbol = this.addNumberSymbol(this.param.num);
            }
            this.index = this.param.id;
            this.numStyle = `color:${this.param.fontColor};font-size:${this.param.fontSize}`;
            this.unit_titleStyle = `color:${this.param.titleColor};font-size:${parseInt(this.param.fontSize)*0.66}px`;
            let {dataSource,field,url} = this.param;
            if(dataSource === "server" && field.length > 0 && url){
                
                this.httpGet(url);
                this.getApiData();
            }
        },
        // 计时器固定请求
        getApiData(){
            let {url,frequency} = this.param;
            clearInterval(this.saveTimeout);
            let time = frequency * 1000;
            this.saveTimeout = setInterval(()=>{
                this.httpGet(url);
            },time)
        },
        // 获取数据
        httpGet(url){
            let {field,agent} = this.param;
            let crossUrl = url;
            let href = window.location.href;
            if(agent && href.indexOf("/apps/mapdashboard") > -1){
                crossUrl = href.slice(0,href.indexOf("/apps/mapdashboard"));
                crossUrl = crossUrl + "/apps/viewer/getUrlResource.json?url=" + encodeURIComponent(url);
            }
            this.$http.get(crossUrl).then((res)=>{
                let content = res.data;
                if( typeof(res.data) === "string" ){
                    content = JSON.parse(content);
                }
                let len = field.length;
                let data = 0; 
                for(let i=0;i<len;i++){
                    content = content[field[i]];
                    data = content;
                }
                this.numberSymbol = data;
                if(this.isNumber(data)){
                    this.numberSymbol = this.addNumberSymbol(data);
                }
            })
        }
    }
}
</script>

<style scoped>
    .indicator-widget {
        width: 100%;
        height: 100%;
    }
    .indicator-body {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        padding: 10px 0 0 10px;
    }
    .indicator-head {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        height: 30%;
        padding-left: 5px;
    }
    .indicator-title {
        font-size: 18px;
        line-height: 30px;
        font-weight: bolder;
    }
    .indicator-content {
        height: 50%;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: flex-end;
        font-weight: bolder;
        padding-top: 10px;
    }
    .indicator-num {
        text-indent: 5px;
        font-weight: bolder;
    }
    .indicator-nuit {
        text-indent: 5px;
    }
</style>
