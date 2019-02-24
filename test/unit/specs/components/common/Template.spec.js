import util from '../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import Template from '@/components/common/Template'
import Bus from '@/utils/eventBus'

describe("Template.vue-保存用户信息弹窗组件", ()=>{
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = shallowMount(Template,{
        i18n
    });

    it("selectTemplate-选择模板",()=>{
        let index = 1;
        wrapper.vm.selectTemplate(index);
        expect(wrapper.vm.template.baseSetting.themeColor).toBe('blackTheme');
    });
}); 
