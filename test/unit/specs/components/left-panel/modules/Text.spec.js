import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import Text from '@/components/left-panel/modules/Text'
import Bus from '@/utils/eventBus'

describe("Text.vue-左侧图表选择组件的测试", ()=>{
    let i18n = util.i18n;
    let wrapper = mount(Text,{
        i18n
    });

    it("selectText-初始化是否正确",()=>{
        wrapper.vm.selectText = jest.fn();
        wrapper.find(".text-list").trigger("click");
        expect(wrapper.vm.selectText).toHaveBeenCalled();
        expect(wrapper.vm.selectText.mock.calls[0][0]).toBe("普通文字");
    });
});
