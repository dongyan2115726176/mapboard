import util from '../../../TestUtil'
import { mount } from '@vue/test-utils'
import WidgetUtils from '@/components/common/WidgetUtils'
import Bus from '@/utils/eventBus'

describe("WidgetUtils.vue-共用移动组件", ()=>{
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = mount(WidgetUtils,{
        i18n,
        propsData:{
            allSize:false,
            param:{
                index:1
            }
        }
    });

    it("onMove-组件移动",()=>{
        let toResize = wrapper.find('.handle-move-resize');
        Bus.$emit = jest.fn();
        toResize.trigger("mousedown");
        expect(Bus.$emit.mock.calls[0][0]).toEqual("widget-move");
    });
});
