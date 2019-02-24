<template>
    <div id="dashBoard-setting">
        <div class="flex-row">
            <span class="f14">{{$t("mapDashboardName")}}：</span>
        </div>
        <div class="flex-row">
            <el-input
                class="textSetting-input"
                v-model="dashBoardUserParam.name"
                size="mini"
                @input="changeAppName"
            >
            </el-input>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("setSize")}}：</span>
            <el-select
                v-model="dashBoardInitParam.midSize"
                @change ="configDashBoardSetting"
                class="select-fill-bg-color"
                size="mini"
            >
                <el-option
                    v-for="item in mapDashBoardSizeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("backgroundType")}}：</span>
        </div>
        <div class="flex-row">
            <el-select
                v-model="dashBoardInitParam.fillType"
                class="bg-select-type"
                size="mini"
            >
                <el-option
                    v-for="item in fillOption"
                    :key="item.type"
                    :label="item.label"
                    :value="item.type"
                >
                </el-option>
            </el-select>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row" v-show="showColorFill">
            <span class="f13 row-line-height">{{$t("color")}}:</span>
            <el-color-picker
                class="select-fill-bg-color"
                @change ="configDashBoardSetting"
                v-model="dashBoardInitParam.background"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
        </div>
        <div class="flex-row" v-show="showColorFill">
            <span class="f13 row-line-height">{{$t("widgetColor")}}:</span>
            <el-color-picker
                class="select-fill-bg-color"
                @change ="configDashBoardSetting"
                v-model="dashBoardInitParam.widgetBackground"
                show-alpha
                :predefine="WidgetPredefineColors">
            </el-color-picker>
        </div>
        <!-- 图片填充DOM -->
        <div class="flex-row" v-show="!showColorFill">
            <span class="f14">{{$t("currentBackground")}}：</span>
        </div>
        <div class="flex-row" v-show="!showColorFill">
            <img src="" alt="这个是图片">
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f13 row-line-height">{{$t("themeColor")}}：</span>
            <el-select
                v-model="dashBoardInitParam.theme"
                class="select-fill-bg-color"
                size="mini"
                @change="changeTheme"
            >
                <el-option
                    v-for="item in themeOption"
                    :key="item.index"
                    :label="item.title"
                    :value="item.label"
                    :title="item.title"
                >
                    <img :src="item.image" alt="" class="theme-color-img">
                </el-option>
            </el-select>
        </div>
        <div class="flex-row">
            <canvas class="canvas-color-img" ref="themeColorList" width="166" height="21"></canvas>
        </div>
    </div>
</template>

<script>
    import Bus from '../../../utils/eventBus';
    import ThemeStyle from '../../../utils/themeStyle'
    export default {
        name:"DashBoardSetting",
        data () {
            return {
                showColorFill:true, // 默认展示颜色填充DOM
                fillOption:[
                    {label:this.$t("colorFill"),type:"color"},
                    // {label:"图片填充",type:"img"}
                ],
                colorType:"pure", // 颜色类型 纯色or渐变
                predefineColors:["#3eb0e7","#7bc684","#ce7f4a"], //自定义默认颜色推荐选项
                WidgetPredefineColors:["rgba(0,0,0,0.8)","rgba(255,255,255,0.8)"],
                themeOption: ThemeStyle,
                mapDashBoardSizeOption:[
                    {label:"1920 x 1080",value:'1920/1080'},
                    {label:"1600 x 900",value:'1600/900'},
                    {label:"1280 x 720",value:'1280/720'},
                ]
            }
        },
        props:{
            baseSetting:{
                type: Object,
                required: true
            },
            appConfig:{
                type:Object,
                required:true
            }
        },
        computed:{
            dashBoardInitParam(){
                let {width,height,themeId,fillType,background,widgetBackground,themeColor} = this.baseSetting;
                width = parseInt(width);
                height = parseInt(height);
                let midSize = `${width}/${height}`;
                this.changeTheme(themeId,true);
                return {themeId,themeColor,fillType,background,widgetBackground,midSize};
            },
            dashBoardUserParam(){
                let {name} = this.appConfig;
                return {name};
            }
        },
        methods: {
            dashBoardConfigParam(){
                let param = this.baseSetting;
                let {midSize,themeId,themeColor,fillType,background,widgetBackground} = this.dashBoardInitParam;
                param.themeId = themeId;
                param.themeColor = themeColor;
                param.fillType = fillType;
                param.background = background;
                param.widgetBackground = widgetBackground;
                let size = midSize.split("/");
                param.width = size[0] + "px";
                param.height = size[1] + "px";
                Bus.$emit("DashBoardSetting-Container",param);
                return param;
            },
            configDashBoardSetting(){
                return this.dashBoardConfigParam();
            },
            // 更改大屏名称
            changeAppName(val){
                let param = this.appConfig;
                let {name} = this.dashBoardUserParam;
                param.name = name;
                return param;
            },
            // 更改主题系列
            changeTheme(themeTitle,isInit){
                if(!themeTitle){
                    return;
                }
                let themeOption = this.searchThemeStyle(themeTitle);
                this.baseSetting.themeId = themeTitle;
                let themePlan = themeOption.themeStyle;
                let {theme} = themePlan;
                this.baseSetting.themeColor = theme;
                Bus.$emit("theme-change",themePlan,isInit);
                let bodyDom = document.getElementsByTagName("body")[0];
                let bodyTheme = bodyDom.getAttribute("class");
                if(bodyTheme != theme){
                    this.changeBackgroundColor(theme);
                    bodyDom.setAttribute("class",theme);
                    // 从大屏传到左侧chart和indicator
                    Bus.$emit("dbSetting-left-moudles",theme);
                }
                this.changeThemeCanvasImg(themeOption.image);
            },
            // 改变Canvas的引用图片
            changeThemeCanvasImg(image){
                if(!this.$refs.themeColorList){
                    if(image){
                        setTimeout(()=>{
                            this.changeThemeCanvasImg(image);
                        },50)
                    }
                    return;
                }
                let ctx = this.$refs.themeColorList.getContext('2d');
                let colorImg = new Image(166,21);
                colorImg.src = image;
                colorImg.onload = ()=>{
                    ctx.drawImage(colorImg,-10,0,166,21);
                }
            },
            // 切换主题的背景色
            changeBackgroundColor(theme){
                let param = this.baseSetting;
                if(theme === "whiteTheme" && param.background === "#20222D"){
                    param.background = "#E1E1E1";
                    Bus.$emit("toggle-settingPanel","");
                    Bus.$emit("DashBoardSetting-Container",param);
                }
                if(theme === "blackTheme" && param.background === "#E1E1E1"){
                    param.background = "#20222D";
                    Bus.$emit("toggle-settingPanel","");
                    Bus.$emit("DashBoardSetting-Container",param);
                }
            },
            // 查找并返回当前的主题
            searchThemeStyle(themeLabel){
                let len = this.themeOption.length;
                for(let i=0;i<len;i++){
                    let label = this.themeOption[i].label;
                    if(themeLabel === label){
                        return this.themeOption[i];
                    }
                }
            }
        }
    }
</script>
<style scoped>
    #dashBoard-setting {
        padding: 0 20px;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .el-select.bg-select-type.el-select--mini{
        margin-top: 13px;
    }
    .textSetting-input.el-input.el-input--mini{
        padding-top: 13px;
    }
    .bg-select-type {
        width: 247px;
        height: 28px;
    }
    .row-line-height {
        line-height: 28px;
    }
    .select-fill-bg-color {
        width: 164px;
        height: 28px;
    }
    .theme-color-img {
        display: block;
        margin: 0 auto;
        margin-top: 6px;
    }
    .canvas-color-img {
        pointer-events: none;
        position: relative;
        top: -35px;
        left: 85px;
    }
</style>
<style>
    .x-setting-line {
        display: block;
        width: 247px;
        height: 1px;
        margin-bottom:23px;
        margin-top: 23px;
        background-color: #272F3A;
    }
    .el-color-picker__trigger {
        width: 100%;
        height: 100%;
        padding: 0;
        border:none;
    }
    .el-color-picker__icon {
        display: none;
    }
    .select-color-radio .el-radio-button__inner {
        width: 82px;
        height: 28px;
        border-radius: 0!important;
    }
    .bg-select-type .el-input__inner {
        border-radius:0;
    }
    .el-input > .el-input__inner {
        border-radius:0;
    }
    .el-color-picker__color.is-alpha {
        margin-top: 4px;
        width: 163px;
        height: 22px;
        border: 1px solid ;
        background-image: none;
        text-align: center;
        border-radius: 0px;
        border-color: #272F3A;
        background-color:  #0E1013;
    }
    .el-color-picker__color.is-alpha > span {
        margin: 2px;
        width: 157px;
        height: 16px;
        border-radius: 0px;
    }
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
        font-weight: 500;
    }
    .el-select-dropdown__item.selected{
        font-weight: 500;
    }
    .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 0;
    }
    .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0;
    }
    .el-checkbox__inner {
        border-radius: 3px;
    }
</style>
<style>
    #Chinese .mini-input {
        width: 64px;
        height: 28px;
    }
    #English .mini-input {
        width: 60px;
        height: 28px;
    }
</style>

