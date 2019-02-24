<template>
    <div id="user-config">
        <div class="flex-row-between">
            <span class="list-title">
                {{$t("headline")}}：
            </span>
            <el-input
                v-model="userConfig.name"
                size="small"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="flex-row-between">
            <span class="list-title">
                {{$t("label")}}：
            </span>
            <el-input
                v-model="userConfig.tags"
                size="small"
                class="list-size"
            >
            </el-input>
        </div>
        <div class="user-config-tips">
            <p>{{$t("labelTips")}}</p>
        </div>
        <div class="flex-row-between">
            <span class="list-title">
                {{$t("describe")}}：
            </span>
            <el-input
                class="text-area"
                type="textarea"
                v-model="userConfig.description"
                size="small"
            >
            </el-input>
        </div>
        <el-button
            type="primary"
            size="small"
            class="real-data-btn"
            @click="onGetRealData"
        >
            {{$t("save")}}
        </el-button>
    </div>
</template>

<script>
import Bus from '../../utils/eventBus'
export default {
    name: 'MDInfo',
    data(){
        return {
            userConfig:{
                name:"",
                tags:"",
                description:""
            }
        }
    },
    props: {
        needParams:{
            type: Object,
            required: true
        }
    },
    created(){
        this.initUserConfig();
    },
    methods: {
        //初始化用户信息参数
        initUserConfig(){
            let config = JSON.parse(JSON.stringify(this.needParams)).config;
            let {name,tags,description} = config;
            this.userConfig.name = name;
            this.userConfig.description = description;
            this.userConfig.tags = tags.join(",");
        },
        //点击按钮保存用户信息
        onGetRealData(){
            let {name,tags,description} = this.userConfig;
            tags = tags.replace(/，/g,",");
            let tagsArr = tags.split(",");
            tagsArr.map((item,index)=>{
                if(!item){
                    tagsArr.splice(index,1);
                }
            })
            let params = {};
            params.name = name;
            params.description = description;
            params.tags = tagsArr;
            params.state = this.needParams.state;
            Bus.$emit("update-userConfig",params);
            Bus.$emit("show-popup",false);
        }
    }
}
</script>

<style scoped> 
    #user-config {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        width: 410px;
        height: 255px;
        padding: 5px;
    }
    .flex-row-between {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 14px;
    }
    .list-title {
        display: block;
        line-height: 32px;
    }
    .list-size {
        width: 338px;
    }
    .text-area {
        width: 338px;
        height: 70px;
    }
    .user-config-tips > p {
        text-indent: 65px;
        font-size: 12px;
        margin-bottom: 14px;
        color: #7A7A7A;
    }
    .real-data-btn {
        align-self:flex-end;
        width: 64px;
        height: 28px;
        margin-top: 10px;
    }
</style>
<style>
    #user-config .text-area > .el-textarea__inner {
        height: 100%;
        border-radius: 2px;
        resize:none;
    }
</style>

