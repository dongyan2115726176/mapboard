import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import LiveDataForApi from '@/components/left-panel/liveData/LiveDataForApi.vue'
import Bus from '@/utils/eventBus'

describe("LiveDataForApi.vue-左侧图表选择组件的测试", ()=>{
    let i18n = util.i18n;
    window.location = {
        href:"iportal/apps/mapdashboard"
    }
    let wrapper = mount(LiveDataForApi,{
        i18n,
        propsData:{
            needParams:[
                {
                    "dataSource":"api",
                    "label":"API数据1",
                    "value":"demoUrl.json",
                    "agent":true
                }
            ]
        }
    });
    it("LiveDataForApi-初始化是否正确",()=>{
        expect(wrapper.props().needParams[0].label).toBe("API数据1");
    });

    it("checkRepeat-检查重复",()=>{
        let url = "demoUrl.json";
        expect(wrapper.vm.checkRepeat(url)).toBe(true);
    });

    it("onGetRealData-添加数据",()=>{
        Bus.$emit = jest.fn();
        wrapper.setData({
            title:"API-1",
            url:"demo2.json"
        })
        wrapper.find('.api-data-btn').trigger("click");
        expect(Bus.$emit.mock.calls[0][1].value).toBe("demo2.json");
    });
});
