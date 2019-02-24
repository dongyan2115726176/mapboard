<template>
    <div id="image-setting">
        <div class="image-title-wrap">
            <span class="image-title">{{$t("imageTitle")}}：</span>
            <el-input
                class="textSetting-input"
                v-model="imageParam.title"
                @input="configTextWidget"
                size="mini"
            >
            </el-input>
        </div>
        <p class="f14">{{$t("uploadImage")}}：</p>
        <div class="image-setting-wrap">
            <el-upload
                class="upload-logo"
                :action="defaultSaveLogoUrl"
                :show-file-list="false"
                :http-request="imgPost"
                :on-error="uploadLogoFailed"
                :on-success="uploadLogoSuccess"
            >
                <!-- <el-button class="upload-btn" size="small" type="primary" v-show="!imageParam.imageSrc">+</el-button> -->
                <img :src="imageBtn" alt="" class="upload-btn" v-show="!imageParam.imageSrc">
                <p class="upload-img-change" v-show="imageParam.imageSrc">{{$t("changeImage")}}</p>
            </el-upload>
            <img class="image-preview" :src="imageParam.imageSrc" alt="" v-show="imageParam.imageSrc">
            <p class="f13" v-show="!imageParam.imageSrc">{{$t("addImage")}}</p>
            <span v-show="!imageParam.imageSrc">{{$t("addImageSupportFirst")}}</span>
            <br v-show="!imageParam.imageSrc">
            <span v-show="!imageParam.imageSrc">{{$t("addImageSupportSecond")}}</span>
        </div>
    </div>
</template>

<script>
    import imgRequest from '../../../../utils/upload'
    import addImageBtn from '../../../../assets/images/plus_btn.png'
    export default {
        name:"ImageSetting",
        data () {
            return {
                urlHead: window.location.href, // 头部url
                defaultSaveLogoUrl: "{LOCATION}/web/uploadfile.json?toFile=./resources/homepage/", // 图片保存地址
                imageBtn: addImageBtn
            }
        },
        props: {
            param: {
                type:Object,
                required:true
            }
        },
        computed:{
            imageParam(){
                let {title,imageSrc} = this.param;
                return {title,imageSrc};
            }
        },
        created(){
            //　修改默认的url
            let href = window.location.href;
            if(href.indexOf("/apps/mapdashboard")){
                let url = href.slice(0,href.indexOf("/apps/mapdashboard"));
                this.urlHead = url;
                this.defaultSaveLogoUrl = url + "/web/uploadfile.json?toFile=./resources/homepage/";
            }
        },
        methods: {
            // 图片发送的POST地址
            imgPost (file) {
                if(file.file.size === 0){
                    this.$message({
                        type: "warning",
                        message: this.$t("imageErr")
                    });
                    return;
                }
                let {file:{type,uid}} =file;
                type = type.slice(type.indexOf("/")+1);
                let action = `${this.defaultSaveLogoUrl}md_image${uid}.${type}`;
                //action = `http://192.168.13.121:8090/iportal/web/uploadfile.json?toFile=./resources/homepage/md_image${uid}.${type}`;
                file.action = action;
                imgRequest (file);
            },
            // 发送失败 接口
            uploadLogoFailed (err) {
                // 默认为从未登陆过
                let errMessage = this.$t("uploadLogin");
                // 未登录进入
                if(String(err).indexOf("401") > -1){
                    if(window.MD.userName){
                        // 之前登陆过失效了
                        errMessage = this.$t("uploadReLogin");
                    }
                }else{
                    // 非图片格式文件
                    errMessage = this.$t("uploadNoSupport");
                }
                this.$message({
                    type: "warning",
                    message: errMessage
                });
            },
            // 发送成功接口
            uploadLogoSuccess(response, file, fileList){
                // http://192.168.13.121:8090/iportal/resources/homepage/md_image1540255857853.png
                let url = this.urlHead + "/resources/homepage/"+ response.fileName;
                this.param.imageSrc = url;
                this.configTextWidget(file.name);
            },
            // 修改标题头
            configTextWidget(val){
                let param = this.param;
                let title = val;
                param.title = title;
                return param;
            }
        }
    }
</script>
<style scoped>
    #image-setting {
        padding: 0 20px;
    }
    .image-setting-wrap {
        width: 236px;
        height: 138px;
        margin-top: 13px;
        padding-top: 20px;
        text-align: center;
        position: relative;
        top:0px;
        left:0px;
        background: #0E1013;
    }
    .image-setting-wrap > p {
        color: #919CA5;
    }
    .image-setting-wrap > span {
        font-size: 12px;
        color: #919CA5;
        opacity: 0.35;
    }
    .image-title-wrap {
        margin-bottom: 10px;
    }
    .image-title {
        display: block;
        margin-bottom:10px;
    }
    .textSetting-input {
        width: 236px;
    }
    .image-preview {
        position: absolute;
        top: 0px;
        left:0px;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
    }
    .upload-logo {
        height: 30px;
        margin: 0 auto;
        margin-bottom: 9px;
    }
    .upload-btn {
        display: block;
        width: 20px;
        height: 20px;
    }
    .upload-img-change {
        width: 100%;
        height: 29px;
        font-size: 13px;
        line-height: 29px;
        position: absolute;
        bottom:0px;
        left: 0px;
        z-index: 10;
        text-align: center;
        background: rgba(68,68,68,0.40);
    }
</style>
<style>
    #image-setting  .el-upload {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        padding: 5px;
    }
    #image-setting .el-upload {
        background-color: #14A5FC;
    }
</style>

