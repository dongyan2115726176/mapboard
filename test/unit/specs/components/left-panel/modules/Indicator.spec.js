import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import Indicator from '@/components/left-panel/modules/Indicator'
import Bus from '@/utils/eventBus'
describe('测试左侧面板Indicator.vue', () => {
    let i18n = util.i18n;
    const wrapper = mount(Indicator,{
        i18n
    });
    it('测试DOM实例', () => {
        expect(wrapper.find('.indicator-list').text()).toBe("统计指标");
    })
    it("Bus.$on('theme-change')-测试接收大屏主题样式", () => {
        let themeStyle = {
            indicator:{
                title:"#ffffff",
                body:"#2D808D"
            }
        }
        Bus.$emit("theme-change",themeStyle);
        expect(wrapper.vm.titleUnitColor).toBe("#ffffff");
    })
    it('selectIndicator-测试点击生成统计字段列表', () => {
        Bus.$emit = jest.fn();
        wrapper.find('.indicator-list').trigger("click");
        expect(Bus.$emit.mock.calls[0][1].icon).toBe("md-icon-indicator");
    })
    it('selectIndicator-测试点击生成统计字段列表', () => {
        wrapper.find('.indicator-list').trigger("click");
        expect(Bus.$emit.mock.calls[0][1].icon).toBe("md-icon-indicator");
    })
})