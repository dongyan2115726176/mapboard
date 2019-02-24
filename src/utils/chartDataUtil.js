import Axios from 'axios';
import Bus from './eventBus';
import Graph from './graph';
 const chartDataUtil = {
    // 获取CSV活EXCEL 类型的数据 初始化统计图
    getData(dataParam,initData=false) {
        let { chartParam:{url}} = dataParam;
        Axios.get(url).then((res) => {
            let features = null;
            let tableName = res.data.fileName.substring(0, res.data.fileName.lastIndexOf('.'));
            if (res.data.type === "EXCEL" || res.data.type === "CSV") {
                features = this.getAttributesObjFromTable(res.data.content.rows, res.data.content.colTitles);
                this._assembleDataCallback(features, features[0], tableName, dataParam,initData);
            } else {
                let dataContent;
                try {
                    dataContent = JSON.parse(res.data.content)
                } catch (error) {
                    dataContent = false;
                }
                if (!dataContent) {
                    Bus.$emit("message-utils","warning",window.locales.readDataError);
                    return;
                }
                // 区分对待geojson以及json，geojson会有type类型
                if (dataContent.type && dataContent.type === "FeatureCollection") {
                    features = this.parseFeatureFromJson(res.data.content);
                    if(features[0].attributes && features[0].attributes instanceof Object){
                        features = features.map((item)=>{
                            return item.attributes;
                        })
                    }
                    this._assembleDataCallback(features, features[0], tableName, dataParam,initData);
                } else if (dataContent instanceof Array) {
                    this._assembleDataCallback(dataContent, dataContent[0], tableName, dataParam,initData);
                }else {
                    Bus.$emit("message-utils","warning",window.locales.readDataError);
                }
            }
        }).catch((error) => {
            Bus.$emit("message-utils","warning",window.locales.promptGetMyDatasFailed);
        });
    },
    //组装构建统计图表的数据
    _assembleDataCallback(features, feature, title, chartWidgetParam,initData=false,isDrag=false) {
        let yAxisFieldList = [], xAxisFieldList = [];
        let { chartParam } = chartWidgetParam;
        for (let key in feature) {
            xAxisFieldList.push(key);
            if ((+feature[key])) {
                yAxisFieldList.push(key);
            }
        }
        let curChartData =  { title, features, xAxisFieldList, yAxisFieldList };
        // 将数据缓存在Window中减少请求
        if (!window.chartData[chartParam.id]) {
            window.chartData[chartParam.id] = curChartData;
            if(initData){return;}
        }
        this.diffTypeChart(curChartData,chartWidgetParam,isDrag);
    },
    // 根据类型不同图标类型 重新格式化数据
    diffTypeChart (data,params,isDrag) {
        if (params.chartType === "annular") {
            this.assemblePieData(data, params,isDrag);
        }else if (params.chartType === "radar") {
            this.initRadarData(data, params,isDrag);
        }else {
            this.initBarData(data, params,isDrag);
        }
    },
     //渐变色赋值工具方法
     gradientColor(option,themeStyle,chartType){
         let isGradient = themeStyle.normal ? true : false;
         if(isGradient){
             //渐变色的处理方式
             let serie = option.series;
             let tempy =0;
             if(chartType === "annular" || chartType === "radar"){
                /*for(let i=0,L=serie[0].data.length; i<L; i++){
                    if(tempy >4){  //轮询五种颜色
                        tempy = 0;
                    }
                    option.series[0].data[i].itemStyle = {
                        normal : themeStyle.normal[tempy],
                        emphasis : themeStyle.emphasis
                    }
                    tempy++;
                }*/
                 option.color = themeStyle.body;
                 return option;

             }
             for(let i=0,L=serie.length; i<L ; i++){
                 if(tempy >4){  //轮询五种颜色
                     tempy = 0;
                 }
                 if(chartType === "line"){
                     option.series[i].areaStyle = {
                         opacity: 0.15
                     }
                 }else{
                     option.series[i].itemStyle = {
                         normal : themeStyle.normal[tempy],
                         emphasis : themeStyle.emphasis
                     }
                 }
                 tempy++;
                 //处理xbar 有点烦
                 if(chartType === "xbar"){
                     option.series[i].itemStyle.normal.color.x = 1;
                     option.series[i].itemStyle.normal.color.y2 = 0;
                     option.series[i].itemStyle.normal.color.y = 0;
                 }else if(chartType === "bar"){
                     option.series[i].itemStyle.normal.color.x = 0;
                     option.series[i].itemStyle.normal.color.y2 = 1;
                     option.series[i].itemStyle.normal.color.y = 0;
                 }
             }
             option = JSON.parse(JSON.stringify(option));
         }else {
             option.series.map((item)=>{
                 item.itemStyle = undefined;
                 item.areaStyle = undefined;
             });
             if(chartType === "annular" || chartType === "radar"){
                 option.series[0].data.map((item)=>{
                     item.itemStyle = undefined;
                 });
             }else {
                 option.series.map((item)=>{
                     item.emphasis.itemStyle.color = themeStyle.heighLight;
                 });
             }
         }
         option.color = themeStyle.body;
         return option;
     },
    // 初始化柱状图 折线图
    initBarData({ title, features, xAxisFieldList, yAxisFieldList }, chartWidgetParam,isDrag) {
        let graph = new Graph();
        graph.option.title.textStyle.color = chartWidgetParam.defaultColor.title;
        let bodyTheme = document.getElementsByTagName("body")[0].getAttribute("class");
        graph.option = this.changeChartThemeColor(graph.option,bodyTheme);
        let { chartType, chartParam } = chartWidgetParam
        chartParam.xAxisField = xAxisFieldList[0];
        chartParam.YAxisField.push(yAxisFieldList[0]);
        graph.showAxis();
        graph.updateTooltipTrigger("axis", null);
        yAxisFieldList = yAxisFieldList.slice(0,1);
        let len = yAxisFieldList.length;
        if (len === 0) {
            graph.updateSeriesToNull();
            return;
        }
        graph.creatSeries(len,chartWidgetParam.defaultColor.heighLight);
        graph.updateSeriesType(chartType);
        for (let i = 0; i < len; i++) {
            graph.updateSeriesName(i, yAxisFieldList[i]);
            graph.updateSeriesData(i, graph.assembleYaxisData(features, yAxisFieldList[i]),chartType);
        }
        let option = JSON.parse(JSON.stringify(graph.option));
        graph.option = this.gradientColor(option,chartWidgetParam.defaultColor,chartWidgetParam.chartType);
        graph.updateLegend(yAxisFieldList);
        graph.updateTitle(title);
        graph.updatexAxisData(graph.assembleaxisData(features, xAxisFieldList[0]));
        if (features.length < 8) {
            graph.updateXAxisLablerotate(0);
        }
        let curOption = graph.option;
        if (chartType === "xbar") {
            graph.updateXAxisLablerotate(0);
            graph.updateSeriesType("bar");
            let { xAxis, yAxis } = curOption;
            curOption.xAxis = yAxis;
            curOption.yAxis = xAxis;
            }
        if(chartType === "line"){
            curOption.tooltip.axisPointer.type = "line";
            curOption.tooltip.axisPointer.shadowStyle.color = "rgba(231,243,252,0.4)";
            curOption.xAxis.boundaryGap = false;
        }
        this.addChart(curOption, chartWidgetParam,isDrag);
    },
     //渲染饼图
     assemblePieData({ title, features, xAxisFieldList, yAxisFieldList }, chartWidgetParam,isDrag) {
        let graph = new Graph();
        graph.option.tooltip.show = false;
        graph.option.title.textStyle.color = chartWidgetParam.defaultColor.title;
        graph.option.color = chartWidgetParam.defaultColor.body;
        let bodyTheme = document.getElementsByTagName("body")[0].getAttribute("class");
        graph.option = this.changeChartThemeColor(graph.option,bodyTheme);
        let {chartParam } = chartWidgetParam;
        chartParam.xAxisField = xAxisFieldList[0];
        chartParam.YAxisField = yAxisFieldList[0];
        graph.hiddenAxis();
        graph.setPieOptions();
        // graph.updateTooltipTrigger("item", "{b}: {c} ({d}%)");
        graph.updateSeriesData(0, graph.formatPieSeriesData( features, xAxisFieldList[0], yAxisFieldList[0]),"annular");
        let option = JSON.parse(JSON.stringify(graph.option));
        graph.option = this.gradientColor(option,chartWidgetParam.defaultColor,chartWidgetParam.chartType);
        graph.updateLegend(graph.formatPieLegendData(features, xAxisFieldList[0]));
        graph.updateSeriesName(0, title);
        graph.updateTitle(title);
        let curOption = graph.option;
        this.addChart(curOption, chartWidgetParam,isDrag);
     },

     //组装雷达图数据以及参数
     initRadarData ({ title, features, xAxisFieldList, yAxisFieldList }, chartWidgetParam,isDrag){
         let graph = new Graph();
         graph.option.title.textStyle.color = chartWidgetParam.defaultColor.title;
         graph.option.color = chartWidgetParam.defaultColor.body[0];
         let bodyTheme = document.getElementsByTagName("body")[0].getAttribute("class");
         let {chartType,chartParam } = chartWidgetParam;
         chartParam.xAxisField = xAxisFieldList[0];
         chartParam.YAxisField = [yAxisFieldList[0]];
         chartParam.maxField = yAxisFieldList[0];
         graph.hiddenAxis();
         graph.updateSeriesData(0, graph.formatRadarSeriesData(features, yAxisFieldList[0]),chartType,yAxisFieldList[0]);
         let option = JSON.parse(JSON.stringify(graph.option));
         graph.option = this.gradientColor(option,chartWidgetParam.defaultColor,chartWidgetParam.chartType);
         graph.updateLegend([yAxisFieldList[0]]);
         graph.updateSeriesType(chartType);
         graph.updateSeriesName(0, title);
         graph.updateTitle(title);
         graph.setRadarOptions();
         graph.option.radar.indicator = graph.setRadarIndicator(features, xAxisFieldList[0], yAxisFieldList[0]);
         graph.option = this.changeRadarChartThemeColor(graph.option,bodyTheme);
         let curOption = graph.option;
         curOption.tooltip = {};
         this.addChart(curOption, chartWidgetParam,isDrag);
     },

     // 添加统计图表 
     addChart(curOption, chartWidgetParam,isDrag) {
        let chartParam = chartWidgetParam;
        chartParam.option = curOption;
        let { chartParam:{id},index } = chartWidgetParam;
        if (id === "chartDemo") {
            if(isDrag){
                Bus.$emit("widgetDrag-mid",chartParam);
                return;
            }
            // 在App 组件中$on调用 为应用添加默认图表组件
            Bus.$emit("update-components", chartParam);
        }else {
            // 在ChartSettingl 组件中$on调用  初始化对应的配置组件
            Bus.$emit("chartData-chartSetting", curOption,index);
            // 在Dashbord.vue 组件中$on调用  同步原有对应的图表参数
            Bus.$emit("update-chartData", chartParam);
        }
     },
     // 组装EXCEL格式数据
     getAttributesObjFromTable(rows, colTitles){
        if (rows.length === 0 || colTitles.length === 0) {
            return;
        }
        var attrArr = [];
        for (var i = 0; i < rows.length; i++) {
            var obj = {};
            for (var j = 0; j < colTitles.length; j++) {
                obj[colTitles[j]] = rows[i][j]
            }
            attrArr.push(obj);
        }
        return attrArr;
     },
     // 解决JSON格式数据
     parseFeatureFromJson: function (feature) {
        var format = new SuperMap.Format.GeoJSON();
        var features = format.read(feature);
        //兼容insights数据格式
        if (features == null) {
            var content = JSON.parse(feature.replace(/'/, '"'));
            if (content.isAnalyseResult || content.type === 'MapEditor' || content.type === 'DataInsights' || content.type === 'ISERVER') {
                content = content.data.recordsets[0].features;
            }
            format = new SuperMap.Format.GeoJSON();
            features = format.read(content);
        }
        for (var i = 0, len = features.length; i < len; i++) {
            features[i].attributes = features[i].attributes.properties || features[i].attributes;
        }
        return features;

    },
     //格式化饼图所需数据
     formatPieSeriesData(data, x, y) {
         let pieData = data.map((item) => {
             item = this._assembleData(item);
             //name这个值有可能是数字型，需要转换为字符串型，不然可能导致饼图显示不出数据的缺陷
             return { value: item[y], name: item[x].toString() }
         })
         return pieData;
     },
    //格式化饼图 环形图的图例数据
    formatPieLegendData(data, x) {
         let legendData = data.map((item) => {
             item = this._assembleData(item);
             //name这个值有可能是数字型，需要转换为字符串型，不然可能导致饼图显示不出数据的缺陷
             return item[x].toString();
         })
         return legendData;
     },
    //数据格式转变， 因为支持多来源数据，不同来源数据结构不同，这里转换一下,内部使用
    _assembleData(item) {
         if (item.attributes) {
             item = item.attributes;  //地图数据
         } else if (item.properties) {
             item = item.properties;  //geoJson 数据
         }
         return item;
     },
     //组装Y轴数据
     assembleYaxisData(data, title) {
         let yData = data.map((item) => {
             item = this._assembleData(item);
             return item[title];
         });
         return yData;
     },
     //为统计计数功能组装Y轴数据
     assembleYaxisDataForS(data,xparam) {
         let rData = {
             x: [],
             y:[]
         };
         data.forEach((item)=>{
             item = this._assembleData(item);
             let index = rData.x.indexOf(item[xparam]);
             if (index !== -1){
                 rData.y[index] = rData.y[index]+1;
             }else{
                 rData.x.push(item[xparam]);
                 rData.y.push(1);
             }
         })
         return rData;
     },
    //组装X轴数据
    assembleaxisData(data, xparam) {
         let xData = data.map((item) => {
             item = this._assembleData(item);
             for (let key in item) {
                 if (key === xparam) {
                     return item[key]
                 }
             }
         })
         return xData;
     },
     //根据y轴数据选择数量重置series数据结构
     creatSeries(len,type,color) {
        type ==="xbar"&& (type="bar");
        let series = [];
        for (let i = 0; i < len; i++) {
            series.push({
                name: '',
                type: type,
                data: [],
                barMaxWidth: '50',
                emphasis: {
                    itemStyle: {
                        color: color
                    }
                }
            });
        }
        return series;
     },

    // 兼容条形图排序与其他图相反操作
    specialHandleXbar(sortedData, sortType, echartType) {
         if (echartType === "xbar" && sortType === "descending") {
             sortedData.sort((a, b) => a - b);
             return sortedData;
         }
         if (echartType === "xbar" && sortType === "ascending") {
             sortedData.sort((a, b) => b - a);
             return sortedData;
         }

         sortedData.sort((a, b) => a - b);
         if (sortType === "descending") {
             sortedData.sort((a, b) => b - a);
         }
         return sortedData;
     },

    // 统计图数据排序
    sortGraphData(data, sortKey, sortType, echartType) {
         let sortedData = this.assembleYaxisData(data, sortKey);
         let otherGrapData = [];
         sortedData = this.specialHandleXbar(sortedData, sortType, echartType);
         /* 
          * 排序后的数据出现值相同时
          * 会在组装统计图所需要的数据遍利时多重复添加相同值项 
          * 多次排序多次会导致累计增加
          * 所以在组装前需要过滤相同值的数据
          */
         sortedData = sortedData.filter(function (item, index, arr) {
             return arr.indexOf(item) == index;
         });

         // 根据排序后的结果 组装统计图所需要的数据 
         sortedData.forEach((value) => {
             data.forEach((item) => {
                 item = this._assembleData(item);
                 if (item[sortKey] === value) {
                     otherGrapData.push(item);
                 }
             });
         });
         return otherGrapData;
     },
     // 雷达图更改颜色
    changeRadarChartThemeColor(option,theme){
        let comColor = "#ffffff";
        let splitLineColor = [
            'rgba(255,255,255,1)','rgba(255,255,255,0.8)',
            'rgba(255,255,255,0.6)','rgba(255,255,255,0.4)',
            'rgba(255,255,255,0.2)','rgba(255,255,255,0.1)'
        ];
        let axisLineColor = "rgba(255,255,255,0.3)";
        if(theme === "whiteTheme"){
            comColor = "#353535";
            splitLineColor = [
                'rgba(53,53,53,1)','rgba(53,53,53,0.8)',
                'rgba(53,53,53,0.6)','rgba(53,53,53,0.4)',
                'rgba(53,53,53,0.2)','rgba(53,53,53,0.1)'
            ];
            axisLineColor = "rgba(53,53,53,0.3)";
        }
        option.legend.textStyle.color = comColor;
        option.title.textStyle.color = comColor;
        option.radar.name.textStyle.color = comColor;
        option.radar.splitLine.lineStyle.color = splitLineColor;
        option.radar.axisLine.lineStyle.color = axisLineColor;
        return option;
    },
    // 柱状图 折线图 条形图 饼状图 更改颜色
    changeChartThemeColor(option,theme){
        if(theme === "blackTheme"){
            option.legend.textStyle.color = "#ffffff";
            option.title.textStyle.color = "#ffffff";
            if(option.yAxis) {
                option.yAxis.axisLine.lineStyle.color = "#ffffff";
                option.xAxis.axisLine.lineStyle.color = "#ffffff";
            }
        }else{
            option.legend.textStyle.color = "#353535";
            option.title.textStyle.color = "#353535"
            if(option.yAxis){
                option.yAxis.axisLine.lineStyle.color = "#353535";
                option.xAxis.axisLine.lineStyle.color = "#353535";
            }
        }
        return option;      
    },
    // 创建雷达图Series的data
    createdRadarSeriesData(featuresData,YAxisField){
        let data = [];
        YAxisField.map((fieldItem)=>{
            let single = {
                value: [],
                name:fieldItem
            }
            featuresData.map((dataItem)=>{
                single.value.push(dataItem[fieldItem]);
            })
            data.push(single);
        })
        return data;
    },
    // 创建雷达图indicator
    createdRadarIndicator (featuresData,nameField,maxField){
        let indicator = [];
        featuresData.map((item)=>{
            indicator.push({
                name:item[nameField],
                max:item[maxField]
            })
        })
        return indicator;
    },
    // 更新图例
    updateLegend(YAxisField){
        let data = [];
        YAxisField.map((item)=>{
            data.push(item);
        })
        return data;
    },
    // 更改折线图 线 圆滑
    changeLineSmooth(option,state){
        option.series.map((item)=>{
            item.smooth = state;
        })
        return option;
    }
}
export default chartDataUtil;