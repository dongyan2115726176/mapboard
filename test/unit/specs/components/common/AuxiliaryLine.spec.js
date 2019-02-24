import util from '../../../TestUtil'
import { mount } from '@vue/test-utils'
import AuxiliaryLine from '@/components/common/AuxiliaryLine'
import Bus from '@/utils/eventBus'

describe("WidgetUtils.vue-共用移动组件", ()=>{
    let i18n = util.i18n;
    let wrapper = mount(AuxiliaryLine,{
        i18n
    });
    it('测试widgets-auxiliary-line方法',()=>{
        wrapper.setData({
            isShow:true
        })
        let style = {
            top:100,
            bottom:10,
            left:50,
            right:100,
            width:100,
            height:100
        }
        Bus.$emit("widgets-auxiliary-line", true,style);
        expect(wrapper.vm.xTop).toBe("100px");
        expect(wrapper.vm.yLeft).toBe("50px");
    })
});
