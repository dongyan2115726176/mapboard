import util from '../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import Transfer from '@/components/common/Transfer'
import Bus from '@/utils/eventBus'

describe('Transfer.vue-分享组件测试', () => {
    let i18n = util.i18n;
    const wrapper = shallowMount(Transfer,{
        propsData:{
            widgetList:[
                {
                    id:1565656
                },
                {
                    id:1565656
                }
            ]
        },
        i18n
    });
    it("重复监听右侧设置面板的BUS toggle-settingPanel",()=>{
        Bus.$emit("toggle-settingPanel",{
            type: "Indicator",
            dataSource:"server",
            nls:"statisticsIndicator",
            icon:"md-icon-indicator",
            id: 1565656,
            title: '指标标题',
            num:'指标数字',
            unit: '单元',
            fontSize: "24px",
            fontColor: '#ffffff',
            titleColor: '#dcdcdc',
            agent:true,
            url:"",
            field:[],
            frequency:5,
            style:{
                top: "400px",
                left:"500px",
                width:"300px",
                height:"100px"
            }
        })
        expect(wrapper.vm.activeId).toBe(1565656)
    })
    it("acticeDashBoardList-激动当前组件",()=>{
        let widgetParam = {
            type: "Indicator",
            dataSource:"server",
            nls:"statisticsIndicator",
            icon:"md-icon-indicator",
            id: 1565656,
            title: '指标标题',
            num:'指标数字',
            unit: '单元',
            fontSize: "24px",
            fontColor: '#ffffff',
            titleColor: '#dcdcdc',
            agent:true,
            url:"",
            field:[],
            frequency:5,
            style:{
                top: "400px",
                left:"500px",
                width:"300px",
                height:"100px"
            }
        }
        Bus.$emit = jest.fn()
        wrapper.vm.acticeDashBoardList(widgetParam)
        expect(Bus.$emit.mock.calls[1][1]).toBe(1565656)
        expect(Bus.$emit.mock.calls[0][1]).toBe(1)
    })
})