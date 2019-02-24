/**
 * Created on 2018/3/30 0030.
 * 统计图相关的工具类,支持多个图表
 */
let commonOption= {
    textStyle:{
        fontFamily: "Microsoft YaHei Light"
    },
    title: { //图表名称设置相关
        x : "left",
        text: window.locales.demonstrationData,
        textStyle: {
            color: '#fff',
            fontWeight: "100",
            fontFamily: "Microsoft YaHei Light"
        },
        padding:[5,0,0,20]
    },
    grid: {
        left:50,
        bottom:70
    },
    legend: {
        show: true,
        type: "scroll",
        bottom: 15,
        textStyle:{
            color: "#fff"
        },
        data: [""]
    },
    backgroundColor: '',
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐 标轴指示器，坐标轴触发有效
            type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
                color:"rgba(231,243,252,0)"
            },
        },
        textStyle:{
            align:'left'
        }
    },
    xAxis: {
        show:true, //是否显示横坐标轴
        type : 'category', //坐标轴类型
        name: "", //坐标轴名称
        nameLocation: "end",  //坐标轴名称的位置
        nameGap: 2,   //坐标轴名称距离坐标轴的距离
        axisLabel:{ //坐标轴上边的标签
            rotate:0,
            fontFamily:"MicrosoftYaHei"
        },
        axisLine:{   //X轴的线型相关
            lineStyle:{
                color:"#fff"
            }
        },
        axisTick:{
            alignWithLabel: true
        },
        splitLine: { //X轴坐标的向上延伸线设置，暂时关闭此选项
            show: false,
            lineStyle: {
                color:"#E9E9E9",
                type: 'solid'
            }
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    color: ["#3BA1FF", "#9FDBFF", "#168AD1", "#4F64E6", "#CE3214"],
    yAxis: {
        type: "value",
        name: "",
        nameLocation: "end",
        nameGap: 5,
        show:true,
        scale: true,
        axisLabel:{
            rotate: 0,
            fontFamily:"MicrosoftYaHei"
        },
        axisLine:{
            lineStyle:{
                color:"#fff"
            }
        },
        splitLine: {
            show:false,
            lineStyle: {
                color:"#E9E9E9",
                type: 'solid',
                width: 0.3
            }
        },
        nameTextStyle:{
            padding:[0,0,5,0]
        }
    },
    series: [{
        name: '',
        type:'bar',
        barMaxWidth: '50',
        data:[10, 52, 200, 334, 390, 330, 220]
    }]
};
/*创建图表基类
* option: 图表的参数
* */
export default class graph {

    constructor() {
        this.option = JSON.parse(JSON.stringify(commonOption));   //简单的一个深度复制，复制这种简单的object结构足矣
    }
    //修改title文字
    updateTitle(title) {
        this.option.title.text = title;
    }
    //修改tooltip悬浮触发器
    updateTooltipTrigger(trigger,formatter) {
        this.option.tooltip.trigger = trigger;
        this.option.tooltip.formatter = formatter;
    }
    //修改tooltip的显示类型
    updateTooltipType(type) {
        this.option.tooltip.axisPointer.type = type;
    }
    //更新图例
    updateLegend(legendData) {
        this.option.legend.data = legendData;
    }
    //根据y轴数据选择数量重置series数据结构
    creatSeries(len,color) {
        let series = [];
        for(let i=0; i<len; i++){
            series.push({
                name: '',
                type: "bar",
                data: [],
                barMaxWidth: '50',
                emphasis:{
                    itemStyle:{
                        color: color
                    }
                }
            });
        }
        this.option.series = series;
    }
    /*修改series数据 name string 名称*/
    updateSeriesName(index,name) {
        this.option.series[index].name = name;
    }
    //更新series类型数据
    updateSeriesType(type) {
        for(let i=0,len=this.option.series.length; i<len; i++){
            this.option.series[i].type = type;
        }
    }
    //更新series类型数据
    updateSeriesData(index,data,type,xName) {
        if(type === "radar"){
            this.option.series[index].data = [{
                value : data,
                name: xName,
                areaStyle:{
                    normal:{
                        opacity: 0.1
                    }
                }
            }];
        }else{
            this.option.series[index].data = data;
        }
    }
    //更新series排序方式（ 金字塔图要使用）
    updateSeriesSort(type) {
        this.option.series[0].sort = type;
    }
    //置空series数据 y轴数据不选择时触发
    updateSeriesToNull() {
        this.option.series = [{
            name: '',
            type: "bar",
            barMaxWidth: '50',
            data: []
        }];
    }
    /*修改颜色属性，柱状图的颜色*/
    updateColor(color) {
        this.option.color = color;
    }
    /*修改设置X轴数据*/
    updatexAxisData(data) {
        this.option.xAxis.data = data;
    }
    //设置X轴标题
    updateXAxisName(name) {
        this.option.xAxis.name = name;
    }
    //设置Y轴的标题
    updateYAxisName(name) {
        this.option.yAxis.name = name;
    }
    //设置x轴的坐标倾斜度
    updateXAxisLablerotate(rotate){
        this.option.xAxis.axisLabel.rotate = rotate;
    }
    /*隐藏坐标轴设置*/
    hiddenAxis() {
        this.option.xAxis.show = false;
        this.option.yAxis.show = false;
    }
    //显示坐标轴设置
    showAxis() {
        this.option.xAxis.show = true;
        this.option.yAxis.show = true;
    }
    //组装Y轴数据
    assembleYaxisData(data,title) {
        let yData = data.map((item)=>{
            item= this._assembleData(item);
            return item[title];
        });
        return yData;
    }
    //组装X轴数据
    assembleaxisData(data,xparam) {
        let xData=data.map((item)=>{
            item= this._assembleData(item);
            for (let key in item){
                if(key === xparam){
                    return item[key]
                }
            }
        })
        return xData;
    }

    // 兼容条形图排序与其他图相反操作
    specialHandleXbar(sortedData, sortType, echartType) {
        if (echartType === "xbar" && sortType === "descending" ) {
            sortedData.sort((a, b) => a - b);
            return sortedData;
        }
        if (echartType === "xbar" && sortType === "ascending"){
            sortedData.sort((a, b) => b - a);
            return sortedData;
        }

        sortedData.sort((a, b) => a - b);
        if (sortType === "descending") {
            sortedData.sort((a, b) => b - a);
        }
        return sortedData;
    }

    // 统计图数据排序
    sortGraphData (data,sortKey,sortType,echartType) {
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
        sortedData.forEach((value)=>{
            data.forEach((item)=>{
                item = this._assembleData(item);
                if (item[sortKey] === value) {
                    otherGrapData.push(item);
                }
            });
        });
        return otherGrapData;
    }
    //格式化饼图所需数据
    formatPieSeriesData(data, x, y) {
        let pieData=data.map((item)=>{
            item= this._assembleData(item);
            //name这个值有可能是数字型，需要转换为字符串型，不然可能导致饼图显示不出数据的缺陷
            return {value:item[y],name:item[x].toString()}
        })
        return pieData;
    }
    //格式化雷达图数据
    formatRadarSeriesData(data,y) {
        let radarData = data.map((item)=>{
            item = this._assembleData(item);
            return item[y];
        });
        return radarData;
    }
    //格式化饼图 环形图的图例数据
    formatPieLegendData(data, x){
        let legendData=data.map((item)=>{
            item= this._assembleData(item);
            //name这个值有可能是数字型，需要转换为字符串型，不然可能导致饼图显示不出数据的缺陷
            return item[x].toString();
        })
        return legendData;
    }
    //数据格式转变， 因为支持多来源数据，不同来源数据结构不同，这里转换一下,内部使用
    _assembleData(item){
        if(item.attributes){
            item = item.attributes;  //地图数据
        }else if(item.properties){
            item = item.properties;  //geoJson 数据
        }
        return item;
    }
    //设置环形图的特殊设置
    setPieOptions() {
        this.option.series = [{
            name: '',
            type: "pie",
            radius : ["50%","70%"],
            avoidLabelOverlap: false,
            label:{
                normal: {
                    formatter:"{b}({d}%)",
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine:{
                normal: {
                    show: false
                }
            },
            data: []
        }];
    }
    //设置雷达图的特殊参数
    setRadarOptions() {
        delete this.option.xAxis;
        delete this.option.yAxis;
        this.option.radar = {
            shape: "circle",
            name: {
                textStyle: {
                    color: 'rgb(255, 255, 255)'
                }
            },
            radius: "70%", //控制雷达图的大小
            splitNumber: 5,
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)',
                        'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.6)',
                        'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            indicator: []
        }
    }
    setRadarIndicator (data, x, y){
        let radarData = data.map((item)=>{
            item = this._assembleData(item);
            return {name: item[x],max:item[y]};
        });
        return radarData;
    }
}
