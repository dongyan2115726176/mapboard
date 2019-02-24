<template>
    <div id="share">
        <div class="share-left-tab">
            <div class="tab-slide active">{{$t("public")}}</div>
        </div>
        <div class="share-right-content">
            <div class="public-content">
                <p 
                    v-for="(item,index) in publicUserStateOption"
                    :key="index"
                >
                     <el-checkbox
                        v-model="publicUserStateArr[index]"
                        @change="onPublicUserStateChange(index)"
                    >
                        {{item.label}}
                    </el-checkbox>
                </p>
                <el-button
                    class="public-btn"
                    @click="onPublicUserStatePost"
                >
                    {{$t("confirm")}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '../../utils/eventBus'
import CommonUtil from '../../utils/commonUtil'
export default {
    name: 'Share',
    data(){
        return {
            publicUserState:"SEARCH",
            publicUserStateArr: [true,false,false],
            publicUserStateOption:[
                {label:this.$t("publicSearch")},
                {label:this.$t("publicRead")},
                {label:this.$t("publicReadWrite")}
            ]
        }
    },
    props:{
        needParams:{
            type:Object,
            required:true
        }
    },
    created(){
        let {authorizeSetting} = this.needParams;
        this.publicUserState = CommonUtil.getUserState(authorizeSetting);
        this.initPublicShareState(this.publicUserState);
    },
    methods: {
        // 初始化公开当前权限
        initPublicShareState(userState){
            switch(userState){
                case "SEARCH":
                    this.publicUserStateArr = [true,false,false];
                    return;
                case "READ":
                    this.publicUserStateArr = [true,true,false];
                    return;
                case "READWRITE":
                    this.publicUserStateArr = [true,true,true];
                    return;
                case "PERSONAL":
                    this.publicUserStateArr = [false,false,false];
                    return;
            }
        },
        // 公开权限修改
        onPublicUserStateChange(index){
            if(index === 0){
                if(this.publicUserStateArr[0] === false){
                    this.publicUserState = "PERSONAL";
                }else{
                    this.publicUserState = "SEARCH";
                }
            }else if(index === 1){
                if(this.publicUserStateArr[1] === false){
                    this.publicUserState = "SEARCH";
                }else{
                    this.publicUserState = "READ";
                }
            }else {
                // index === 2
                if(this.publicUserStateArr[2] === false){
                    this.publicUserState = "READ";
                }else{
                    this.publicUserState = "READWRITE";
                }
            }
            this.initPublicShareState(this.publicUserState);
        },
        // 发送请求 更改当前App权限
        onPublicUserStatePost(){
            //http://192.168.13.221:8090/iportal/web/mapdashboards/sharesetting.json
            let url = window.MD.hrefHead + "/web/mapdashboards/sharesetting.json"
            let putData = {
                "ids":[this.needParams.id],
                "entities":[]
            }
            if(this.publicUserState !== "PERSONAL"){
                putData.entities.push({
                    "entityName":"GUEST",
                    "entityType":"USER",
                    "permissionType":this.publicUserState
                })
            }
            this.$http.put(url,putData).then((res)=>{
                if(res.data.succeed) {
                    this.$message({
                        showClose: true,
                        message: this.$t("updateSuccess"),
                        type: 'success'
                    })
                    this.upDataLocalUserState()
                }
            }).catch((err)=>{
                this.$message({
                    showClose: true,
                    message: this.$t("saveError"),
                    type: 'error'
                })
            })
        },
        // 请求数据 只更新本地的用户设置数据
        upDataLocalUserState(){
            let url = window.location.href.replace("apps","web").replace("mapdashboard","mapdashboards") + ".json?t="+Date.parse(new Date());
            this.$http.get(url).then((res)=>{
                let {authorizeSetting} = res.data;
                Bus.$emit("update-authorizeSetting",authorizeSetting);
                Bus.$emit("show-popup",false);
            })
        }
    }
}
</script>
<style scoped>
    #share {
        width: 400px;
        height: 270px;
        color: #FFFFFF;
        position: relative;
        top:0;
        left: 0;
        overflow: hidden;
    }
    .share-left-tab {
        float: left;
        box-sizing: border-box;
        width: 60px;
        height: 100%;
        text-align: left;
        padding:10px 0 0 8px;
        font-size: 13px;
        border-right: 1px solid#252C35;
    }
    .tab-slide {
        width: 100%;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
    }
    .tab-slide.active {
        color: #14A5FC;
        border-right: 2px solid #14A5FC;
    }
    .share-right-content {
        width: 340px;
        height: 100%;
        float: right;
        box-sizing: border-box;
        padding: 10px 0 0 20px;
    }
    .public-content > p {
        margin-bottom: 15px;
    }
    .public-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
</style>


