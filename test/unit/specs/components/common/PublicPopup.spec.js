import util from '../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import PublicPopup from '@/components/common/PublicPopup.vue'
import Bus from '@/utils/eventBus'

describe("PublicPopup.vue-公共弹窗组件", ()=>{
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = shallowMount(PublicPopup,{
        i18n,
        propsData:{
            showPopup:false,
            popupParams:{
                path:'common/MDInfo',
                title:'heihei',
                params:{
                    
                }
            }
        }
    });

    it("测试阻止冒泡方法stopPropagation",()=>{
        let ev = {
            pageX:200,
            pageY:200,
            stopPropagation:()=>{
                wrapper.vm.popupParams.title = "hello"
            }
        }
        
        wrapper.vm.stopPropagation(ev);
        expect(wrapper.vm.popupParams.title).toBe("hello")
    }); 
});
