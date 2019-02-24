import util from '../../../../TestUtil.js'
import { shallowMount } from '@vue/test-utils'
import SceneSetting from '@/components/right-panel/widgets/SceneSetting.vue'
import Bus from '@/utils/eventBus'
describe('测试右侧SceneSetting.vue', () => {
    let i18n = util.i18n;
    let sceneParam = {
        type: "Scene",
        nls:"scene",
        title: "我是标题",
        icon:"md-icon-scene",
        sceneId: "123456",
        sceneUrl:"baidu.com",
        positopn: null,
        fullScreen:true,
        scanEffect: {
            status: false, //是否为开启状态
            type: "noScan",
            centerPostion: null,
            _period: 2000,
            speed: 500,
            color: null
        },
        style:{
            height: "400px",
            width: "500px",
            left: "500px",
            top: "300px"
        }
    }
    let wrapper = shallowMount(SceneSetting,{
        i18n,
        propsData:{
            baseSetting:util.appConfig.content.baseSetting,
            "param":sceneParam
        }
    });
    it('sceneInitParam-计算属性是否生效', () => {
        wrapper.setProps({
            param:{
                fullScreen:false,
                scanEffect: {
                    status: false, //是否为开启状态
                    type: "noScan",
                    centerPostion: null,
                    _period: 2000,
                    speed: 500,
                    color: null
                },
                style:{width:"50px",height:"60px"}
            }
        })
        expect(wrapper.vm.sceneInitParam.fullScreen).toBe(false);
    })
    it('setSceneParam-修改配置', () => {
        wrapper.vm.setSceneParam();
        expect(wrapper.vm.sceneInitParam.width).toBe(50);
    })
    it('sceneFullScreen-组件全屏', () => {
        wrapper.setProps({
            param:{
                fullScreen:true,
                scanEffect: {
                    status: false, //是否为开启状态
                    type: "noScan",
                    centerPostion: null,
                    _period: 2000,
                    speed: 500,
                    color: null
                },
                style:{width:"50px",height:"60px"}
            }
        })
        wrapper.vm.sceneFullScreen();
        expect(wrapper.vm.sceneInitParam.fullScreen).toBe(false);
    })
})