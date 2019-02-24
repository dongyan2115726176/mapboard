import util from '../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import SettingPanel from '@/components/SettingPanel'
import Bus from '@/utils/eventBus'
describe('测试右侧侧面板SelectPanel.vue', () => {
    let i18n = util.i18n;
    const wrapper = shallowMount(SettingPanel,{
        i18n,
        propsData:{
            dataList:[],
            baseSetting:{},
            appConfig:{
                content:{
                    components:[]
                }
            }
        }
    });
    it('SelectPanel', () => {
        expect(wrapper.vm.dataList.length).toBe(0);
    })
    it('Bus.$on("toggle-settingPanel")-切换配置组件', (done) => {
        wrapper.setData({reRender:true});
        Bus.$emit("toggle-settingPanel",{type:"Map"})
        setTimeout(()=>{
            expect(wrapper.vm.reRender).toBe(false);
            expect(wrapper.vm.componentName).toBe("Map");
            done();
        },100);
    })
})