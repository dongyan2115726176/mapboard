// 兼容老版本的config配置文件
const compatibleConfig = {
    // 保持旧用户仍然可用
    updata(config){
        let {baseSetting,components,dataList} = config.content;

        baseSetting = this.updataBaseSetting(baseSetting);

        components = this.updataComponents(components,baseSetting);

        dataList = this.updataDataList(dataList);

        return {baseSetting,components,dataList}
    },
    // 兼容大屏设置
    updataBaseSetting(baseSetting){
        if(baseSetting.widgetBackground == undefined){
            baseSetting.themeId = "themeA";
            baseSetting.themeColor = "blackTheme";
            baseSetting.widgetBackground = "rgba(0,0,0,0.8)";
            delete baseSetting.theme;
        }
        return baseSetting;
    },
    // 兼容组件
    updataComponents(components,baseSetting){
        let width = baseSetting.width;
        let height = baseSetting.height;
        components.map((item,index)=>{
            // 处理左右位置移动问题
            if(item.style.left == ""){
                item.style.left = (parseInt(width) - parseInt(item.style.right) - parseInt(item.style.width)) + "px";
                delete item.style.right;
            }
            // 处理上下位置移动问题
            if(item.style.top == ""){
                item.style.top = (parseInt(height) - parseInt(item.style.bottom) - parseInt(item.style.height)) + "px";
                delete item.style.bottom;
            }
            if(item.id == ""){
                item.id = index;
            }
            // 处理地图参数
            if(item.type === "Map" && item.fullScreen == undefined){

                item.fullScreen = false;
                item.scaleLine = false;
                item.overviewMap = false;
                item.zoom = item.level;
                delete item.pitch;
                delete item.level;
            }
            // 处理指标参数
            if(item.type === "Indicator" && item.titleColor == undefined){
                item.titleColor = "#ffffff";
                item.field = [];
                item.agent = true;
            }
            // 处理文本参数
            if(item.type === "Text" && item.fontFamily == undefined){
                item.fontFamily = "Microsoft YaHei";
                item.fontWeight = "normal";
                item.textAlign = "center";
                item.textIndent = "0px";
            }
            // 处理图表参数
            if(item.type === "Chart" && item.defaultColor == undefined){
                item.defaultColor = {
                    title:"#ffffff",
                    body:["#15D1F2","#499BFF","#2C61FF","#243BCC","#67A9FF"],
                    heighLight:"#A8CFFF"
                }
                item.chartParam.autoPlay = false;
                item.chartParam.frequency = 5;
                item.chartParam.agent = true;
                item.widgetFile = `charts/${this.getfielName(item.chartType)}`;
                item.settingFile = `charts/${this.getfielName(item.chartType)}`;
            }

        })
        return components;
    },
    // 兼容数据列表
    updataDataList(dataList){

        return dataList;
    },
    // 获得图表对应的文件名称
    getfielName(chartType){
        let name = "Bar";
        if(chartType === "bar" || chartType === "xbar" || chartType === "line"){
            name = "Bar";
        }else if(chartType === "annular"){
            name = "Pie";
        }
        return name;
    }
}
export default compatibleConfig;