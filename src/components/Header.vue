<template>
    <div id="header">
        <!-- 非布局下显示内容 -->
        <div class="header-content-wrap">
            <div class="header-left">
                <div class="header-logo-wrap">
                    <img class="header-logo inline-block-middle" :src="logo" alt="Logo"
                    @click = openIportalHome>
                </div>
                <h1 class="header-title inline-block-middle text-overflow">{{appConfig.name}}</h1>
            </div>
            <div class="header-right">
                <div class="header-icon-wrap inline-block-middle" @click="appToPreview(true)" v-show="1">
                    <i class="md-icon-preview f16 inline-block-middle" :title="this.$t('preview')"></i>
                </div>
                <div class="header-icon-wrap inline-block-middle" @click="openAppShare">
                    <i class="md-icon-share f16 inline-block-middle" :title="this.$t('share')"></i>
                </div>
                <div class="header-icon-wrap inline-block-middle">
                    <i @click="saveConfig('save')" :title="this.$t('save')" class="md-icon-save f16 inline-block-middle"></i>
                    <el-popover
                        placement=
                        "bottom"
                        width="70"
                        trigger="hover"
                    >
                        <p class="sava-as-btn" @click="saveConfig('saveAs')">{{$t("saveAs")}}</p>
                        <i slot="reference" class="el-icon-caret-bottom"></i>
                    </el-popover>
                </div>
                <i class="col-line inline-block-middle"></i>
                <div
                    class="header-icon-wrap inline-block-middle user-login-icon text-overflow"
                    style="margin-left:15px"
                    @click="onClickUserIcon"
                >
                    <i class="md-icon-user f16 inline-block-middle"></i>
                    <span :title="isLoginState ? isLoginState : this.$t('noLogin')">{{isLoginState ? isLoginState : this.$t('noLogin')}}</span>
                </div>
            </div>
        </div>

        <!-- 点击登录按钮显示登录窗口 -->
        <div class="login-pop" v-show="showLogin">
            <div class="login-pane-head">
                <i class="md-icon-close" @click="toggleLoginPop(false)"></i>
            </div>
            <div class="login-pane-boby">
                <h1 class="login-title">{{$t("login")}}</h1>
                <el-input
                    class="login-input md-icon-user"
                    name="name"
                    :class="name?'changeColor':''"
                    :placeholder="$t('userName')"
                    v-model="name"
                >
                </el-input>
                <el-input
                    class="login-input md-icon-password" type="password" name="password"
                    :class="password?'changeColor':''"
                    :placeholder="$t('passWord')"
                    v-model="password"
                    @keyup.enter.native="loginEvent"
                >
                </el-input>
                <el-button class="login-btn" type="primary" @click="loginEvent">{{$t("login")}}</el-button>
                <br />
                <span class="login-register" @click="openLoginPage">{{$t("register")}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from "../utils/eventBus";
    import blackThemeLogo from "../assets/images/blackThemeLogo.png";
    export default {
        name: 'Header',
        data () {
            return {
                showLogin: false, // 是否显示登录窗口
                isLoginState: window.MD.userName ? window.MD.userName : false, // 已登录获取信息名，未登录false状态
                name:null, // 用户名
                password:null, // 密码
                logo:blackThemeLogo // Logo 图片
            }
        },
        props: {
            appConfig: {
                type: Object,
                required: true
            }
        },
        methods:{
            // 点击user按钮判断登录的当前状态，
            onClickUserIcon(){
                this.checkIsLogin("user");
            },
            // 点击跳转到用户详情页
            openUserDetails(){
                let url = window.MD.hrefHead+"/web/mycontent/account";
                window.open(url);
            },
            //点击logo跳转到首页
            openIportalHome(){
                let url = window.MD.hrefHead;
                window.open(url);
            },
            // 关闭登录弹窗
            toggleLoginPop(state){
                this.showLogin = state;
            },
            // 用户注册
            openLoginPage(){
                let registerUrl = window.MD.hrefHead+"/web/register";
                window.open(registerUrl);
            },
            // 新开页面预览
            appToPreview(){
                this.$emit("open-preview");
            },
            //登录事件,调用iclient实现iportal的登录,因为reffer问题,仅在代码包中才有效,
            loginEvent(){
                if(this.checkInput(this.name,this.password)){
				    let portalUrl = window.MD.hrefHead;
					SuperMap.SecurityManager.loginiPortal(portalUrl,this.name,this.password)
						.then((result)=>{
					        if(result.succeed){
                                this.checkIsLogin();
					            this.showLogin = false;
					            this.$message({
						            type: "success",
						            message: this.$t("loginSuccess"),
						            showClose: true
					            });
					        }else{
					            this.$message({
						            type: "error",
						            message: this.$t("loginError"),
						            shoeClose: true
					            })
					        }
						});
				}
            },
            // 检测输入内容的合法性
		    checkInput(name,psw) {
                if(name === "" && psw === ""){
					this.$message({
						type: "error",
						message: this.$t("enterError"),
						showClose: true
					})
	                return false;
                }
                return true;
            },
            // 检查登录状态
            checkIsLogin(source,state){
                //http://192.168.13.121:8090/iportal/web/mycontent/account.json
                let url = window.MD.hrefHead+"/web/mycontent/account.json";
                this.$http.get(url).then((res)=>{
                    window.MD.userName = res.data.name;
                    this.isLoginState = window.MD.userName;
                    if(source === "save"){
                        this.$emit("save-config",state);
                    }
                    if(source === "user"){
                        this.openUserDetails();
                    }
                }).catch((error)=>{
                    this.showLogin = true;
                    if(window.MD.userName !== ""){
                        this.$message({
                            type: "error",
                            message: this.$t("userLoginMes"),
                            showClose: true
                        })
                    }
                })
            },
            // 保存应用状态
            saveConfig (state) {
                this.checkIsLogin("save",state);
            },
            // 打开应用程序分享
            openAppShare(){
                if(window.MD.appState !== "edit"){
                    this.$message({
                        type: "warning",
                        message: this.$t("userShareMes"),
                        showClose: true
                    })
                    return;
                }
                let params = {
                    title:this.$t("share"),
                    path:"common/Share",
                    params:this.appConfig
                }
                Bus.$emit("show-popup",true,params); //Head.vue -> App.vue
            }
        }
    }
</script>

<style scoped>
    #header {
        width: 100%;
        background-color: #232528;
    }
    .header-content-wrap {
        height: 46px;
    }
    .header-left {
        float: left;
        width: 550px;
        height: 100%;
        color: #ffffff;
    }
    .inline-block-middle {
        display: inline-block;
        vertical-align: middle;
    }
    .header-logo {
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
    .header-title {
        height: 100%;
	    width: 350px;
        line-height: 46px;
        font-size: 18px;
        padding-left: 26px;
    }
    .header-right {
        float: right;
        width: 320px;
        height: 100%;
        padding-left: 60px;
        color: #A4AFB9;
    }
    .header-icon-wrap {
        width: 45px;
        height: 100%;
        text-align: left;
        line-height: 46px;
        cursor: pointer;
    }
    .header-icon-wrap > i {
        padding-right: 3px;
    }
    .user-login-icon {
        width: 80px;
    }
    .user-login-icon > span {
        font-size: 13px;
        vertical-align: sub;
    }
    .header-icon-wrap > i:hover {
        color: #089DD8;
    }
    .header-icon-wrap > span:hover {
        color: #089DD8;
    }
    .col-line {
        width: 2px;
        height: 18px;
        background-color: #A4AFB9;
        margin:4px 0 0 2px;
    }
    .login-pop {
		display: block;
		width: 350px;
		height: 350px;
		position: fixed;
        top: calc(40% - 167px);
        right: calc(50% - 175px);
        text-align: center;
		z-index: 999999;
		border-radius: 4px;
        background-color:#1D1F24;
        border: 1px solid #20272E;
		box-shadow: 0 5px 15px rgba(0,0,0,.5);
	}
	.login-pop > .login-pane-head {
        height: 38px;
        color: #BDCBD5;
	}
    .login-pane-head > i {
		float: right;
		width: 20px;
		height: 20px;
		font-size: 14px;
		padding: 12px 10px 0 0;
		cursor: pointer;
    }
    .login-pane-boby {
		padding-top: 9px;
	}
    .login-title {
		height: 40px;
    	line-height: 31px;
    	margin-bottom: 30px;
		text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 28px;
        letter-spacing: 4px;
        color: #BDCBD5;
	}
    .login-input {
        border-radius: 3px;
        padding-bottom: 20px;
	}
	.login-input:hover {
		color:#0295dc;
	}
	.login-input::before {
		font-size: 13px;
		position: relative;
    	left: 24px;
    	top: 0px
	}
    .login-btn {
		width: 272px;
		height: 39px;
		font-size: 16px;
		font-weight: lighter;
		margin: 18px 0 0 14px;
		letter-spacing: 5px;
        border-radius: 3px;
	}
    .login-register {
		position: relative;
		top: 10px;
		left:113px;
		font-size: 13px;
		cursor: pointer;
        font-family: MicrosoftYaHei;
        color:  #3B434A;
	}
	.login-register:hover {
		text-decoration:underline;
	}
    .login-input.md-icon-user > input {
        background-color: #EBEBEB;
    }
    .login-input.md-icon-password > input {
        background-color: #EBEBEB;
    }
    .login-input.md-icon-user.changeColor > input {
        background-color: #ffffff;
    }
    .login-input.md-icon-password.changeColor > input {
        background-color: #FFFFFF;
    }
    .login-input > input {
		width: 272px;
		height: 39px;
    	line-height: 40px;
		margin-left: 3px;
		text-indent: 10px;
    	border-bottom: 1px solid #a1a3a5;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        letter-spacing: 0px;
        border-radius: 3px!important;
        background-color: #E0E0E0!important;
        line-height: inherit
    }
</style>
<style>
    #header .login-input > input {
		width: 272px;
		height: 39px;
    	line-height: 40px;
		margin-left: 3px;
		text-indent: 10px;
    	border-bottom: 1px solid #a1a3a5;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        letter-spacing: 0px;
        border-radius: 3px!important;
        background-color: #E0E0E0!important;
    }
    #header .login-input > .el-input__inner:focus {
        background-color: #ffffff!important;
	}
    #Chinese #header .header-logo-wrap {
        display: inline-block;
        width: 46px;
        height: 46px;
        padding: 8px 8px;
    }
    #English #header .header-logo-wrap {
        display: inline-block;
        width: 72px;
        height: 46px;
        padding: 8px 8px 8px 17px;
    }
</style>

