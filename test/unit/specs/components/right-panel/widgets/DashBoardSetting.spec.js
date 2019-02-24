import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import DashBoardSetting from '@/components/right-panel/widgets/DashBoardSetting'

describe('测试右侧DashBoardSetting.vue', () => {
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let baseSetting = util.appConfig.content.baseSetting;
    const wrapper = shallowMount(DashBoardSetting,{
        stubs:['canvas'],
        i18n,
        propsData:{
            "baseSetting": baseSetting,
            "appConfig": appConfig
        }
    });
    it('dashBoardUserParam-计算属性', () => {
        wrapper.setProps({ appConfig: {name:"改变了大屏"} });
        expect(wrapper.vm.dashBoardUserParam.name).toBe("改变了大屏");
    })
    it('dashBoardInitParam-计算属性', () => {
        wrapper.vm.changeTheme = jest.fn();
        wrapper.setProps({ 
            baseSetting: {
                "width":"200px",
                "height":"100px",
                "theme": "themeC",
                "fillType": "color",
                "background": "red"
            } 
        });
        expect(wrapper.vm.changeTheme).toHaveBeenCalled();
        expect(wrapper.vm.dashBoardInitParam.midSize).toBe("200/100");
    })
})