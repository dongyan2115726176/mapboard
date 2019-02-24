import util from '../TestUtil'
import { shallowMount } from '@vue/test-utils'
import App from '@/App'
import Bus from '@/utils/eventBus'

describe('测试App.vue', () => {
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = shallowMount(App,{
        i18n,
    });
    wrapper.setData({
        appConfig:appConfig,
        appContent: appConfig.content
    });
    it('测试最简单的案例', () => {
        expect(wrapper.contains('img')).toBe(true)
    });
    it("saveConfig-保存前的弹窗", ()=>{
        // window.location.href = "http:192.168.13.121:8090/apps/mapdashboard/"
        wrapper.vm.saveConfig("save");
        expect(wrapper.vm.showPopup).toBe(true);
        expect(wrapper.vm.popupParams.params.state).toBe("save");
        wrapper.vm.saveConfig("saveAs");
        expect(wrapper.vm.popupParams.params.state).toBe("saveAs");
        Bus.$emit("show-popup",false);
        expect(wrapper.vm.showPopup).toBe(false);
    });
    it("Bus.$on(update-components)-增/删组件",()=>{
        // 曾加
        Bus.$emit("update-components",{test:3});
        expect(wrapper.vm.appContent.components.length).toBe(1);
        // 删除
        Bus.$emit("update-components",0);
        expect(wrapper.vm.appContent.components.length).toBe(0);
    });
    it("Bus.$on(update-userConfig)-用户修改名称、标签、描述更新",()=>{
        let params = {
            name:"我的大屏",
            description:"一段描述信息",
            tags:["私有大屏"]
        }
        Bus.$emit("update-userConfig",params);
        expect(wrapper.vm.appConfig.name).toBe("我的大屏");
        expect(wrapper.vm.appConfig.description).toBe("一段描述信息");
        expect(wrapper.vm.appConfig.tags.length).toBe(1);
    });
    it("handleSuccessRequest-请求成功",()=>{
        let res = {data:appConfig};
        //请求成功 view 状态
        wrapper.vm.handleSuccessRequest(res);
        expect(wrapper.vm.toPreview).toBe(true);
        //请求成功 再次edit 状态
        appConfig.userName = "admin";
        appConfig.id = "123456";
        wrapper.setData({
            toPreview:false,
            appConfig:appConfig,
            userPowers:true
        })
        wrapper.vm.handleSuccessRequest(res);
        expect(wrapper.vm.toPreview).toBe(false);
        expect(wrapper.vm.mapDashboardID).toBe("123456");
    });
    it("getUserAppsInformation获取用户对APP的权限信息",()=>{
        wrapper.vm.getUserAppsInformation();
        expect(wrapper.vm.userPowers).toBe(true);   
    })
    it("compatibleConfig-兼容config",()=>{
        wrapper.vm.compatibleConfig();
        expect(wrapper.vm.appConfig.content).toEqual(wrapper.vm.appContent);
    })
    it("saveConfig-保存配置文件",()=>{
        Bus.$emit = jest.fn();
        let state = "save";
        let window = {
            location:{
                href:"http://192.168.13.116:8081/"
            }
        }
        wrapper.vm.saveConfig(state);
        expect(Bus.$emit.mock.calls[0][2].path).toBe("common/MDInfo");
        expect(Bus.$emit.mock.calls[0][2].title).toBe("保存大屏");
        state = "view";
        wrapper.vm.saveConfig(state);
        expect(Bus.$emit.mock.calls[1][2].title).toBe("保存");
    })
})