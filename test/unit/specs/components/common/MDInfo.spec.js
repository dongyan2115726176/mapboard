import util from '../../../TestUtil'
import { mount } from '@vue/test-utils'
import MDInfo from '@/components/common/MDInfo'
import Bus from '@/utils/eventBus'

describe("MDInfo.vue-保存用户信息弹窗组件", ()=>{
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = mount(MDInfo,{
        i18n,
        propsData:{
            needParams:{
                config: appConfig,
                state: "save"
            }
        }
    });

    it("initUserConfig-初始化用户信息是否正确",()=>{
        wrapper.vm.initUserConfig();
        expect(wrapper.vm.userConfig.name).toBe("测试大屏");
        expect(wrapper.vm.userConfig.tags).toBe("标签1,标签2,标签3");
    });
    it("initUserConfig-初始化用户信息是否正确",()=>{
        wrapper.setData({
            userConfig:{
                name:"我只是一个标题",
                tags: "我是，一个，，标签",
                description:"描述信息"
            }
        })
        Bus.$emit = jest.fn();
        wrapper.find(".real-data-btn").trigger("click");
        expect(Bus.$emit.mock.calls[0][1].name).toEqual("我只是一个标题");
        expect(Bus.$emit.mock.calls[0][1].tags.length).toBe(3);
    });

    
});
