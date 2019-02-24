import util from '../../TestUtil'
import {
    shallowMount
} from '@vue/test-utils'
import Container from '@/view/Container'
import Bus from '@/utils/eventBus'
describe('测试预览面板大屏Container.vue', () => {
    let i18n = util.i18n;
    const wrapper = shallowMount(Container, {
        i18n,
        propsData: {
            widgetList: [],
            baseSetting: util.appConfig.content.baseSetting
        }
    });
    it('中间DOM样式组装creatMidStyle', () => {
        wrapper.vm.creatMidStyle();
        expect(wrapper.vm.midStyle.transform).toEqual("scale(0,0)")
    })
    it('测试预览view的页面渲染render',()=>{
        wrapper.setProps({
            widgetList:[
                {
                    chartType: "bar",
                    icon: "md-icon-bar",
                    id: 1546571336258,
                    index: 1,
                    nls: "bar",
                    settingFile: "charts/Bar",
                    style: {
                        height: "250px",
                        left: "400px",
                        top: "300px",
                        width: "300px"
                    },
                    title: "示范数据",
                    type: "Chart",
                    widgetFile: "charts/Bar"
                }
            ]
        })
        expect(wrapper.vm.midStyle).toEqual({
            "backgroundColor": "#20222D", 
            "height": "1080px", 
            "transform": "scale(0,0)", 
            "width": "1920px"
        })
           
    })
})
