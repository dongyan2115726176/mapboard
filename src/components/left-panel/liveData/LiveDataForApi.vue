<template>
    <div id="api-live-data">
        <div class="flex-row">
            <span class="f13">{{$t("dataName")}}：</span>
            <el-input
                class="api-data-title"
                v-model="title"
            >
            </el-input>
        </div>
        <div class="flex-row">
            <span class="f13">{{$t("dataAddress")}}：</span>
            <el-input
                class="api-data-url"
                v-model="url"
                type="textarea"
                @input="getApiData"
            >
            </el-input>
        </div>
        <div class="flex-row" v-show="!showRes">
            <span></span>
            <div class="hint-message api-data-url">
                <p class="support-hint-text">{{$t("supportHint")}}</p>
                <p class="cross-domain" v-show="0">{{$t("crossDomain")}}</p>
            </div>
        </div>
        <div class="flex-row" v-show="showRes">
            <span class="f13">{{$t("dataRes")}}：</span>
            <el-input
                class="api-data-res"
                v-model="result"
                type="textarea"
            >
            </el-input>
        </div>
        <div class="flex-row start-flex">
            <span class="f13">{{$t("crossAgent")}}</span>
            <el-checkbox
                v-model="agent"
                class="cross-domain"
            >
            </el-checkbox>
        </div>
        <el-button
            type="primary"
            size="small"
            class="api-data-btn"
            @click="onGetRealData"
            v-show="showRes"
        >
            {{$t("confirm")}}
        </el-button>
    </div>
</template>

<script>
import Bus from "../../../utils/eventBus"
export default {
    name: "LiveDataForApi",
    data () {
        return {
            title:"",
            url:"",
            agent:true,
            result:"",
            showRes:false,
            saveSetTimeout:""
        }
    },
    props:{
        needParams:{
            type: Array,
            required: true
        }
    },
    watch:{
        agent(){
            if(!this.url){
                return;  //url为空时不请求
            }
            this.getApiData();
        }
    },
    methods:{
        // 获取数据
        getApiData(){
            clearTimeout(this.saveSetTimeout);
            if(!this.url){
                return;  //url为空时不请求
            }
            let crossUrl = this.url;
            if(this.agent && window.location.href.indexOf("/apps/mapdashboard") > -1){
                crossUrl = window.MD.hrefHead + "/apps/viewer/getUrlResource.json?url=" + encodeURIComponent(this.url);
            }
            this.saveSetTimeout = setTimeout(()=>{
                this.$http.get(crossUrl).then((res)=>{
                    if(typeof(res.data) != "string"){
                        this.result = JSON.stringify(res.data);
                    }
                    this.showRes = true;
                }).catch((err)=>{
                    this.$message({
                        type: 'warning',
                        message: this.$t("getDataErr")
                    })
                })
            },800)
        },
        // 添加数据
        onGetRealData(){
            if(!this.title || this.title.match(/^[ ]+$/)){
                this.$message({
                    type: 'warning',
                    message: this.$t("emptyDataFlowParams")
                })
                return;
            }
            let param = {
                dataSource:"api",
                label:this.title,
                value:this.url,
                agent:this.agent
            }
            let isRepeat = this.checkRepeat(this.url);
            if(isRepeat){
                this.$message({
                    type: 'warning',
                    message: this.$t("promptRepetitiveData")
                })
                return;
            }
            // 添加数据
            Bus.$emit("add-api-data",param);
            // 关闭弹窗
            Bus.$emit("show-popup",false);
        },
        // 检查重复
        checkRepeat(url){
            let res = false;
            this.needParams.map((item)=>{
                if(item.value === url){
                    res = true;
                }
            })
            return res;
        }   
    }
}
</script>

<style scoped>
    #api-live-data {
        width: 390px;
        overflow:hidden;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    .start-flex {
        justify-content: flex-start;
    }
    .start-flex > .cross-domain {
        margin-left: 7px;
        height:19px;
        line-height: 25px;
        color: #14A5FC;
    }
    .flex-row > span {
        line-height: 28px;
    }
    .api-data-title {
        width: 312px;
        height: 32px;
    }
    .api-data-url {
        width: 312px;
        height: 61px;
    }
    .api-data-res {
        width: 312px;
        height: 104px;
    }
    .api-data-btn {
        float: right;
        width: 67px;
        height: 26px;
        margin-right: 8px;
        line-height: 10px;
    }
    .support-hint-text {
        color: #7A7A7A;
    }
    .hint-message {
        font-size: 12px;
    }
    .hint-message > p {
        padding-bottom: 8px;
    }
    .hint-message > .cross-domain:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>


