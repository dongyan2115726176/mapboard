import util from '../../TestUtil'
import {
    shallowMount
} from '@vue/test-utils'
import Container from '@/components/Container'
import Bus from '@/utils/eventBus'
describe('测试中间面板大屏Container.vue', () => {
    let i18n = util.i18n;
    const wrapper = shallowMount(Container, {
        i18n,
        propsData: {
            widgetList: [],
            baseSetting: util.appConfig.content.baseSetting
        }
    });
    it("Container-初始化是否正确",()=>{
       
    });
})
