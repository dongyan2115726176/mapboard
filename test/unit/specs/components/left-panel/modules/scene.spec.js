import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import mockAxios from 'jest-mock-axios'
import Scene from '@/components/left-panel/modules/Scene'

describe('scene.vue-左侧场景选择组件测试', () => {

    let i18n = util.i18n;
    const wrapper = shallowMount(Scene,{
        propsData:{
            baseSetting:util.appConfig.content.baseSetting,
            widgetList: []
        },
        i18n
    });
    const res = {
        content:[{"thumbnail":"http://test/iportal.png",
            "authorizeSetting":null,"description":null,"updateTime":1540273603841,"userName":"admin","title":null,
            "url":"http://192.168.13.38:8091/test",
            "content":null,"tags":["用户场景"],"visitCount":63,"createTime":1540273603841,"name":"test",
            "nickname":"admin","layers":null,"id":746599796}],
        totalPage: 1
    }
    afterEach(function () {
        // import and pass your custom axios instance to this method
        mockAxios.reset();
    })
    it('handleSuccessRequest-请求三维列表-正确分支', () => {

        wrapper.vm.handleSuccessRequest(res);
        // 断言函数正确执行
        expect(wrapper.vm.totalPage).toBe(1);
        expect(wrapper.find(".map-text").html()).toContain("test");

    })
    it('selectScene-点击场景缩略图事件', ()=>{
        wrapper.find(".scene-item").trigger('click',0);
        expect(wrapper.vm.selectUrl).toBe("http://192.168.13.38:8091/test");
    })

    it('getSceneList-翻页搜索', ()=>{
        wrapper.vm.getSceneList(2);
        expect(wrapper.vm.param.currentPage).toBe(2);
    })



})