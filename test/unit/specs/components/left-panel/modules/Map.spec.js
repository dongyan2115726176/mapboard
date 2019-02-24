import util from '../../../../TestUtil'
import { mount } from '@vue/test-utils'
import Map from '@/components/left-panel/modules/Map'
import Bus from '@/utils/eventBus'

describe("Map.vue-左侧图表选择组件的测试", ()=>{
    let i18n = util.i18n;
    let wrapper = mount(Map,{
        i18n,
        propsData:{
            baseSetting:util.appConfig.content.baseSetting
        }
    });

    it("noMapItem-初始化是否正确",()=>{
        wrapper.setData({mapUnit:[1,2]});
        expect(wrapper.vm.noMapItem).toBe(false);
    });

    it("handleSuccessRequest-地图数据请求成功",()=>{
        let data = {
            content:[
                {thumbnail:1,title:1,sourceType:1,layers:[{url:1}],id:1},
                {thumbnail:2,title:2,sourceType:2,layers:[{url:2}],id:2},
            ],
            totalPage:10
        }
        wrapper.vm.handleSuccessRequest(data);
        expect(wrapper.vm.mapUnit[0].thumbnail).toBe(1);
        expect(wrapper.vm.totalPage).toBe(10);
    });

    it("selectMap-选取地图",()=>{
        window.location = {href:"www.baidu.com/apps/mapdashboard"};
        let mapUnit = [{"title":"test","id":12}];
        wrapper.setData({mapUnit:mapUnit});
        wrapper.vm.selectMap(0);
        expect(wrapper.vm.noMapItem).toBe(false);
    });

    it("getMapList-选取分页",()=>{
        wrapper.vm.getMapList(1);
        expect(wrapper.vm.param.currentPage).toBe(1);
    });
    it("creatMap-创建地图参数",()=>{
        Bus.$emit = jest.fn();
        let curItem = {
            title:"测试标题",
            id: 22
        }
        wrapper.vm.creatMap(curItem,"wwww.abc.com");
        expect(Bus.$emit.mock.calls[0][1].title).toBe("测试标题");
    });
    it("showLiveData-打开数据流服务",()=>{
        wrapper.vm.showLiveData();
        expect(Bus.$emit.mock.calls[1][2].path).toBe("left-panel/modules/LiveDataSetting");
    });
});
