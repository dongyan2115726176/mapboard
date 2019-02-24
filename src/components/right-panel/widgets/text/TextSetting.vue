<template>
    <div id="text-setting">
        <div class="flex-row">
            <span class="f14">{{$t("textContent")}}：</span>
            <el-input
                class="textarea-input"
                v-model="textInitParam.title"
                @input="configTextWidget"
                type="textarea"
                size="mini"
            >
            </el-input>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("font")}}：</span>
            <el-select 
                class="textSetting-input"
                v-model="textInitParam.fontFamily"
                size="mini"
                @change="configTextWidget"
            >
                <el-option
                    v-for="(item,index) in fontFamilyOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :style="'font-family:'+item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("style")}}：</span>
            <el-select 
                class="textSetting-input"
                v-model="textInitParam.fontWeight"
                size="mini"
                @change="configTextWidget"
            >
                <el-option
                    v-for="(item,index) in fontWeightOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("align")}}：</span>
            <el-select 
                class="textSetting-input"
                v-model="textInitParam.textAlign"
                size="mini"
                @change="configTextWidget"
            >
                <el-option
                    v-for="(item,index) in textAlignOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("fontSize")}}：</span>
            <div class="textSetting-input">
                <el-input class="textSetting-input-mini"
                    v-model="textInitParam.fontSize"
                    @input="configTextWidget"
                    size="mini"
                >
                </el-input>
                <span class="f14">{{$t("px")}}</span>
            </div>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("lineHeight")}}：</span>
            <div class="textSetting-input">
                <el-input class="textSetting-input-mini"
                    v-model="textInitParam.lineHeight"
                    @input="configTextWidget"
                    size="mini"
                >
                </el-input>
                <span class="f14">{{$t("px")}}</span>
            </div>
        </div>
        <div class="flex-row">
            <span class="f14">{{$t("textIndent")}}：</span>
            <div class="textSetting-input">
                <el-input class="textSetting-input-mini"
                    v-model="textInitParam.textIndent"
                    @input="configTextWidget"
                    size="mini"
                >
                </el-input>
                <span class="f14">{{$t("px")}}</span>
            </div>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("fontColor")}}：</span>
            <el-color-picker
                class="textSetting-input"
                v-model="textInitParam.color"
                @input="configTextWidget"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("componentSize")}}：</span>
        </div>
        <div class="flex-row">
            <div>
                <span>{{$t("width")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="textInitParam.width"
                    @input  ="configTextWidget"
                    size="mini"
                >
                </el-input>
            </div>
            <div>
                <span>{{$t("height")}}：</span>
                <el-input
                    class="mini-input"
                    v-model="textInitParam.height"
                    @input  ="configTextWidget"
                    size="mini"
                >
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"TextSetting",
        data () {
            return {
                predefineColors: ["#3eb0e7","#7bc684","#ce7f4a"], //自定义默认颜色推荐选项
                fontFamilyOption:[   //自定义字体样式
                    {label:this.$t("microsoftYaHei"),value:"Microsoft YaHei"},
                    {label: "Times New Roman",value:"Times New Roman"},
                    {label:"宋体",value:"宋体"},
                    {label:"黑体",value:"黑体"},
                    {label:"楷体",value:"楷体"}
                ],
                fontWeightOption:[
                    {label:this.$t("lighter"),value:"lighter"},
                    {label:this.$t("normal"),value:"normal"},
                    {label:this.$t("bolder"),value:"bolder"}
                ],// 自定义字体粗细
                textAlignOption:[ // 文字对齐方式
                    {label:this.$t("alignCenter"),value:"center"},
                    {label:this.$t("alignLeft"),value:"left"},
                    {label:this.$t("alignRight"),value:"right"}
                ]
            }
        },
        props: {
            param: {
                type:Object,
                required:true
            }
        },
        computed: {
            // 初始化text配置信息
            textInitParam () {
                let {title,fontSize,textAlign,textIndent,color,lineHeight,fontFamily,fontWeight,style:{width,height}} =this.param;
                width = parseInt(width);
                height = parseInt(height);
                fontSize = parseInt(fontSize);
                textIndent = parseInt(textIndent);
                lineHeight = parseInt(lineHeight);
                return {title,fontSize,textAlign,textIndent,lineHeight,fontFamily,fontWeight,color,width,height};
            },
        },
        methods: {
             // 修改text配置 组合当前最新配置信息
            textConfigParam () {
                let param =this.param;
                let {title,fontSize,lineHeight,textAlign,textIndent,fontFamily,fontWeight,color,width,height} =this.textInitParam;
                param.title = title;
                param.color = color;
                param.fontFamily = fontFamily;
                param.fontWeight = fontWeight;
                param.textAlign = textAlign;
                param.textIndent = (textIndent||0)+"px";
                param.fontSize = (fontSize||0)+"px";
                param.lineHeight = (lineHeight||0)+"px";
                param.style.width = (width||0)+"px";
                param.style.height = (height||0)+"px";
                return param;
            },
            configTextWidget () {
                return this.textConfigParam();
            }
        }
    }
</script>
<style scoped>
    #text-setting {
        padding: 0 20px;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .flex-row > .f14 {
        line-height: 28px;
    }
    .textSetting-input{
        width: 164px;
        height: 28px;
    }
    .textSetting-input-mini {
        width: 110px;
        height: 28px;
    }
    .textarea-input {
        width: 164px;
        height: 88px;
    }
    .mini-input {
        width: 64px;
        height: 28px;
    }
</style>
<style>
    #text-setting .el-color-picker__trigger {
        width: 100%;
        height: 100%;
        padding: 0;
        border:none;
    }
    #text-setting .el-color-picker__icon {
        display: none;
    }
</style>

