<template>
    <div id="time-setting">
        <div class="flex-row">
            <span class="f14">{{$t("font")}}：</span>
            <el-select 
                class="time-setting-input"
                v-model="timeInitParam.timeType"
                size="mini"
                @change="configTimeWidget"
            >
                <el-option
                    v-for="(item,index) in timeTypeyOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <span class="x-setting-line"></span>
        <div class="flex-row">
            <span class="f14">{{$t("font")}}：</span>
            <el-select 
                class="time-setting-input"
                v-model="timeInitParam.fontStyle.fontFamily"
                size="mini"
                @change="configTimeWidget"
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
            <span class="f14">{{$t("fontSize")}}：</span>
            <div class="time-setting-input">
                <el-input class="input-mini"
                    v-model="timeInitParam.fontStyle.fontSize"
                    @input="configTimeWidget"
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
                class="time-setting-input"
                v-model="timeInitParam.fontStyle.color"
                @input="configTimeWidget"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
        </div>
    </div>
</template>

<script>
    export default {
        name:"TimeSetting",
        data () {
            return {
                predefineColors: ["#3eb0e7","#7bc684","#ce7f4a"],
                fontFamilyOption:[   //自定义字体样式
                    {label:this.$t("microsoftYaHei"),value:"Microsoft YaHei"},
                    {label: "Times New Roman",value:"Times New Roman"},
                    {label:"宋体",value:"宋体"},
                    {label:"黑体",value:"黑体"},
                    {label:"楷体",value:"楷体"}
                ],
                timeTypeyOption:[
                    {label:this.$t("timeDate"),value:"date"},
                    {label:this.$t("timeDateSecond"),value:"data+second"},
                    {label:this.$t("timeDateSecondWeek"),value:"data+second+week"},
                ]
            }
        },
        props: {
            param: {
                type:Object,
                required:true
            }
        },
        computed:{
            timeInitParam(){
                let {param:{fontStyle,timeType}} = JSON.parse(JSON.stringify(this.param));
                fontStyle.fontSize = parseInt(fontStyle.fontSize);
                return {fontStyle,timeType};
            }
        },
        methods: {
            timeConfigParam(){
                let param = this.param;
                let {fontStyle,timeType} = this.timeInitParam;
                fontStyle.fontSize = (fontStyle.fontSize || 0) + "px";
                param.param.fontStyle = fontStyle;
                param.param.timeType = timeType;
                return param;
            },
            configTimeWidget(){
                return this.timeConfigParam();
            }
        }
    }
</script>
<style scoped>
    #time-setting {
        padding: 0 20px;
    }
    .flex-row {
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
        line-height: 28px;
    }
    .time-setting-input {
        width: 164px;
        height: 28px;
    }
    .input-mini {
        width: 110px;
        height: 28px;
    }
</style>

