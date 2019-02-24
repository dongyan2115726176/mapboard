import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import Chart from '@/components/left-panel/modules/Chart'
import ChartDataUtil from '@/utils/chartDataUtil'
import Bus from '@/utils/eventBus'
import sinon from 'sinon'

describe("chart.vue-左侧图表选择组件的测试", ()=>{
    let i18n = util.i18n;
    let wrapper = mount(Chart,{
        i18n
    });

    it("creat-初始化工作",()=>{
        expect(wrapper.vm.chartsUnit[0]).toEqual({"img": "test-file-stub", "name": "直方图", "type": "bar"});
    });

    it("dbSetting-left-moudles-根据主题切换图片", ()=>{
        Bus.$emit("dbSetting-left-moudles","whiteTheme");
        expect(wrapper.vm.chartsUnit[0]).toEqual({"img": "test-file-stub", "name": "直方图", "type": "bar"});

        Bus.$emit("dbSetting-left-moudles","blackTheme");
        expect(wrapper.vm.chartsUnit[0]).toEqual({"img": "test-file-stub", "name": "直方图", "type": "bar"});
    });

    it("theme-change-根据主题切换颜色样式", ()=>{
        let mockTheme = {
            theme:"blackTheme",
            chart:{
                title:"#ffffff",
                body:["#15D1F2","#499BFF","#2C61FF","#243BCC","#67A9FF"],
                heighLight:"#A8CFFF"
            },
            text:"#ffffff",
            indicator:{
                title:"#ffffff",
                body:"#499BFF"
            }}
        Bus.$emit("theme-change",mockTheme);
        expect(wrapper.vm.chartColor).toEqual(mockTheme.chart);
    });

    it('selectChart-选择图标类型事件-无数据分支', ()=>{
        //现行 将函数mock成jest函数
        ChartDataUtil._assembleDataCallback = jest.fn();
        wrapper.find(".chart-list-img img").trigger("click");
        //直接断言ChartDataUtil._assembleDataCallback方法被调用
        expect(ChartDataUtil._assembleDataCallback).toHaveBeenCalled();
        //断言参数其中的一个值正确；
        expect(ChartDataUtil._assembleDataCallback.mock.calls[0][3].type).toEqual("Bar");
    });

    it('selectChart-选择图标事件-有数据分支', ()=>{
        ChartDataUtil.diffTypeChart = jest.fn();
        window.chartData["chartDemo"] = "test";
        wrapper.find(".chart-list-img img").trigger("click");
        expect(ChartDataUtil.diffTypeChart).toHaveBeenCalled();
        //该断言与chart 示范数据强行绑定， 更换示范数据是要同步修改该数据；
        expect(ChartDataUtil._assembleDataCallback.mock.calls[0][0][0]).toEqual({"X1": "Mon", "Y1": "100", "Y2": "500", "Y3": "1"});
    });
});
