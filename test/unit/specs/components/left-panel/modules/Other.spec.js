import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import Other from '@/components/left-panel/modules/Other'
import Bus from '@/utils/eventBus'
describe('测试左侧面板Ohter.vue', () => {
    let i18n = util.i18n;
    const wrapper = mount(Other,{
        i18n
    });
    wrapper.setData({otherOption:[{name:"自定义图片A",value:"img"}]})
    it('测试DOM实例', () => {
        expect(wrapper.find('p.f16').text()).toBe("其他类型：");
        expect(wrapper.find('.other-list-title').text()).toBe("自定义图片A");
    })
    it('selectOther-测试点击', () => {
        Bus.$emit = jest.fn();
        let imgBtn = wrapper.find('.other-list');
        imgBtn.trigger("click");
        expect(Bus.$emit.mock.calls[0][0]).toEqual("update-components");
        wrapper.vm.selectOther('time');
    })
})