import util from '../../../../TestUtil'
import {shallowMount } from '@vue/test-utils'
import MapWidget from '@/components/left-panel/widgets/MapWidget'
import Bus from '@/utils/eventBus'

describe("MapWidget.vue-文件组件", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(MapWidget,{
        i18n,
        propsData:{
            param:{
                type: "Map",
                nls:"map",
                title: "地图",
                icon:"md-icon-map-widget",
                mapId: 1,
                id:1,
                mapUrl:"wwww.baidu.com",
                center:[0,0],
                zoom:0,
                fullScreen:true,
                mapEvents: true, // 默认开启地图的鼠标事件
                scaleLine: false, // 比例尺
                overviewMap: false, // 鹰眼
                index:1,
                style: {
                    top: "400px",
                    left: "400px",
                    width: "200px",
                    height: "100px"
                }
            }
        }
    });
    it("MapWidget-初始化是否正确",()=>{
        expect(wrapper.vm.mapInitStyle.style.top).toBe("400px");
    });
});
