import util from '../../../../TestUtil.js'
import { mount } from '@vue/test-utils'
import MapSetting from '@/components/right-panel/widgets/MapSetting.vue'
import Bus from '@/utils/eventBus'
describe('测试右侧MapSetting.vue', () => {
    let i18n = util.i18n;
    let mapParam = {
        type: "Map",
        nls:"map",
        title: "maptitle",
        icon:"md-icon-map-widget",
        mapId: "123",
        mapUrl:"www.baidu.com",
        center:[0,0],
        zoom:0,
        fullScreen:false,
        mapEvents: true, // 默认开启地图的鼠标事件
        scaleLine: false, // 比例尺
        overviewMap: false, // 鹰眼
        style:{
            height: "200px",
            width: "400px",
            left: "50px",
            top: "40px"
        }
    }
    let wrapper = mount(MapSetting,{
        i18n,
        propsData:{
            baseSetting:util.appConfig.content.baseSetting,
            "param":mapParam
        }
    });
    it('mapInitParam-计算属性', () => {
        wrapper.setProps({
            param:{
                zoom: 5,
                center:[10,10],
                style:{
                    height: "100px",
                    width: "500px",
                    left:"32px",
                    top:"10px"
                },
                mapEvents:false,
                scaleLine: false,
                overviewMap: false,
                fullScreen: true
            }
        })
        expect(wrapper.vm.mapInitParam.fullScreen).toBe(true);
    })
    it('setMapParam-参数更改', () => {
        Bus.$emit = jest.fn();
        wrapper.vm.setMapParam();
        expect(Bus.$emit.mock.calls[0][0]).toBe("setting-mapWidget");
    })
    it('mapFullScreen-地图全屏', () => {
        wrapper.vm.mapFullScreen();
        expect(Bus.$emit.mock.calls[1][0]).toBe("mapSetting-mapWidget");
    }) 
})