import util from '../../../../../TestUtil.js'
import { shallowMount } from '@vue/test-utils'
import chartSetting from '@/components/right-panel/widgets/charts/BarSetting.vue'

describe("",()=>{
    let i18n = util.i18n;
    let dataList = [];
    let chartParam = {
        type: "Chart",
        icon:`md-icon-line`,
        nls: "line",
        title: "单元测试数据",
        style: {
            top: "300px",
            left: "400px",
            width: "300px",
            height: "250px"
        },
        chartParam: {
            sortType: "unsort",
            showDataNum: "全部",
            xAxisField: null,
            YAxisField: [],
            id: "chartDemo",
            url: "../../../utils/chart_demo.json",
            dataName: "单元测试数据",
        },
        defaultColor: {
            title:"#ffffff",
            body:["#243BCC","#2C61FF","#499BFF","#15D1F2","#67A9FF"]
        },
        option: util.chartOption
    };
    let wrapper = shallowMount(chartSetting,{
        i18n,
        propsData:{
            "param":chartParam,
            "dataList": dataList
        }
    });

    it("test",()=>{
       expect("1").toBe("1");
    });
});