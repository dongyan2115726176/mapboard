import util from '../../../../TestUtil'
import {shallowMount } from '@vue/test-utils'
import IndicatorWidget from '@/components/left-panel/widgets/IndicatorWidget'
import Bus from '@/utils/eventBus'

describe("IndicatorWidget.vue-文件组件", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(IndicatorWidget,{
        i18n,
        propsData:{
            param:{
                type: "Indicator",
                dataSource:"static",
                nls:"statisticsIndicator",
                icon:"md-icon-indicator",
                id: 20190103,
                index:20190103,
                title: "指标",
                num: "2000",
                unit: "次",
                fontSize: "50px",
                fontColor: "red",
                titleColor: "blue",
                agent:true,
                url:"http://wthrcdn.etouch.cn/weather_mini?city=北京",
                field:["stats"],
                frequency:60,
                style:{
                    top: "400px",
                    left:"500px",
                    width:"300px",
                    height:"100px"
                }
            }
        }
    });
    it("IndicatorWidget-初始化是否正确",()=>{
        expect(wrapper.vm.numberSymbol).toBe("2,000");
    });
    it("Bus.$on('theme-change')-接收大屏的主题样式",()=>{
        let themePlan = {
            indicator:{
                body:"black",
                title:"black"
            }
        }
        Bus.$emit("theme-change",themePlan);
        expect(wrapper.vm.param.fontColor).toBe("black");
    });
    it("addNumberSymbol-数字添加千位符",()=>{
        let num = wrapper.vm.addNumberSymbol(5400);
        expect(num).toBe("5,400");
    });
});
