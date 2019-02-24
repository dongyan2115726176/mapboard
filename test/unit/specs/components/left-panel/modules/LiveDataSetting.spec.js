import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import LiveDataSetting from '@/components/left-panel/modules/LiveDataSetting.vue'
import Bus from '@/utils/eventBus'
describe('测试左侧面板LiveDataSetting.vue', () => {
    let i18n = util.i18n;
    const wrapper = shallowMount(LiveDataSetting,{
        i18n,
        propsData:{
            needParams: {
                "dataSource":"api",
                "label":"API数据1",
                "value":"demoUrl.json",
                "agent":true
            }
            
        }
    });
    it('LiveDataSetting-测试初始化', () => {
        expect(wrapper.find('.list-size').attributes("placeholder")).toBe("请选择");
    })
    it('selectDataSources-选择数据类型', () => {
        wrapper.setData({
            dataSources:""
        })
        wrapper.vm.selectDataSources("dataFlow");
        expect(wrapper.vm.showServer).toEqual([true,false,false]);
    })
})