import util from '../../../TestUtil'
import {shallowMount } from '@vue/test-utils'
import TabPanel from '@/components/left-panel/TabPanel'

describe("TabPanel.vue-切换选择列表", ()=>{
    let i18n = util.i18n;
    let wrapper = shallowMount(TabPanel,{
        i18n,
        propsData:{
            item:{
                iconName:"md-icon-dash-board",
                tabName:"dashBoard",
                component:"DashBoard"
            },
            widgetList:[],
            dataList:[],
            baseSetting:{
                themeId: "themeC",
            }
        }
    });
    it("render-渲染",()=>{
        expect(wrapper.props("baseSetting").themeId).toBe("themeC");
    });
    it("render-渲染",()=>{
        wrapper.setProps({
            item:{
                iconName:"md-icon-data",
                tabName:"data",
                component:"Data"
            }
        })
        expect(wrapper.props("item").component).toBe("Data");
    });
    it("render-渲染",()=>{
        wrapper.setProps({
            item:{
                iconName:"md-icon-text",
                tabName:"text",
                component:"Text"
            }
        })
        expect(wrapper.props("item").component).toBe("Text");
    });
});
