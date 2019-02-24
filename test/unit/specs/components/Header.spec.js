import util from '../../TestUtil'
import { mount } from '@vue/test-utils'
import Header from '@/components/Header'

describe('测试左侧面板Header.vue', () => {
    let i18n = util.i18n;
    const wrapper = mount(Header,{
        i18n,
        propsData:{
            appConfig:{name:"我是头部标题"},
            toLayout:false,
        }
    });
    it('测试头部标题和登录', () => {
        expect(wrapper.find('.header-left h1').text()).toBe("我是头部标题");
        expect(wrapper.find('.user-login-icon span').text()).toBe("admin");
    })
    it('测试点击保存', () => {
        // 点击登录按钮打开
        window.MD.userName = "";
        let toSave = wrapper.find('.header-right .md-icon-save');
        toSave.trigger("click");
        //这个地方留坑，需要mock 请求才是正确的流程。
        expect(wrapper.vm.showLogin).toBe(false);
        wrapper.find('.login-pane-head .md-icon-close').trigger("click");
        expect(wrapper.vm.showLogin).toBe(false);
    })
    // it('测试点击保存', () => {
    //     // 点击登录
    //     wrapper.setData({name:"admin",password:"iportal.123"})
    //     let toLogin = wrapper.find('.login-btn');
    //     toLogin.trigger("click");
    // })
})