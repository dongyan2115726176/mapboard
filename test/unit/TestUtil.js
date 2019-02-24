/**
 * 该文件作为测试的工具文件， 主要的作用是在测试环境中创造出和应用场景中相同的vue 对象，所以相当于应用场景的main.js
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueDND from 'awe-dnd'
import Element from 'element-ui'
import locales from '../../static/nls/zh-CN.js'
import Axios from 'axios'

Vue.use(VueDND)
Vue.use(VueI18n)
Vue.use(Element);
Vue.prototype.$http = Axios;
const i18n = new VueI18n({
    locale : "zh-CN", //当前语言标识
    messages : {
        ["zh-CN"] : window.locales
    }
});

window.MD = {}; // 以后所有的全局变量 请全部挂载在MD 对象下面！
window.lang = "zh-CN";
window.MD.userRole = "ADMIN";
window.MD.userName = "admin";
window.MD.hrefHead = "http://www.demo.com:8090/iportal";
window.chartData = {}
window.ol= {
    supermap: {
        WebMap: function () {
            
        }
    }
}
window.SuperMap = {
    Format: {
        GeoJSON: function () {
            
        }
    }
}

module.exports = {
    i18n: i18n,
    appConfig: {
        "name":"测试大屏",
        "tags":['标签1',"标签2","标签3"],
        "description":"描述信息",
        "userName":"测试用户",
        "content":{
            "baseSetting": {
                "width":"1920px",
                "height":"1080px",
                "themeId": "themeA",
                "themeColor":"blackTheme",
                "fillType": "color",
                "background": "#20222D"
            },
            "dataList": [
            ],
            "components": [
            ]
        }
    },
    chartOption:{
        textStyle:{
            fontFamily: "Microsoft YaHei Light"
        },
        title: { //图表名称设置相关
            x : "left",
            text: "测试标题",
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
            barWidth: '60%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }]
    }
}