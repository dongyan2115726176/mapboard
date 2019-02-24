import util from '../../../../../TestUtil'
import {shallowMount } from '@vue/test-utils'
import TextWidget from '@/components/left-panel/widgets/text/TextWidget'
import Bus from '@/utils/eventBus'

describe("TextWidget.vue-文件组件", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(TextWidget,{
        i18n,
        propsData:{
            param:{
                type: "Text",
                title: "text",
                nls:"commonChar",
                icon:"md-icon-title",
                fontSize: "18px",
                fontFamily:"Microsoft YaHei",
                fontWeight:"normal",
                color: "red",
                index:1,
                style: {
                    top: "400px",
                    left: "400px",
                    width: "200px",
                    height: "100px"
                }
            }
        }
    });
    it("TextWidget-初始化是否正确",()=>{
        expect(wrapper.props("param").style.top).toBe("400px");
    });
    it("Bus.$on('theme-change')-组件主题更换",()=>{
        let themePlan = {text:"black"}
        Bus.$emit("theme-change",themePlan);
        expect(wrapper.props("param").color).toBe("black");
    });
});
