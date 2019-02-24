import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import DashBoard from '@/components/left-panel/modules/DashBoard'
import Bus from '@/utils/eventBus'

describe('DashBoard.vue-左侧场景选择组件测试', () => {

    let i18n = util.i18n;
    const wrapper = shallowMount(DashBoard,{
        propsData:{
            widgetList: []
        },
        i18n
    });
    it('测试widgetLength组件的个数',()=>{
        expect(wrapper.vm.widgetLength).toBe(0)
    })  
    it("测试message-util信息提示",()=>{
        let type = 'success';
        let msg = '保存成功,2秒后页面将自动跳转';
        wrapper.vm.$message = jest.fn()
        Bus.$emit('message-utils',type,msg)
        expect(wrapper.vm.$message).toHaveBeenCalled()
    })
    it('toConfigureSelf配置自身组件',()=>{
        wrapper.setData({
            isActive:2
        })
        let index = 2;
        wrapper.vm.toConfigureSelf(index);
        expect(wrapper.vm.isActive).toBe(-1)
    })
    it("测试toDeleteSelf删除自身",()=>{
        wrapper.setData({
            isActive:2
        }) 
        let index = 2;
        wrapper.vm.$refs.dashBoardScrollbar = {
            top:143,
            scrollToY:(scrollY)=>{scrollY}
        }
        wrapper.vm.$refs.dashBoardScrollbar.scrollToY = jest.fn();
        wrapper.vm.toDeleteSelf(index);
        expect(wrapper.vm.$refs.dashBoardScrollbar.scrollToY.mock.calls[0][0]).toBe(100);
    })
})