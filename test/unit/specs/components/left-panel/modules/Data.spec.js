import util from '../../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import Data from '@/components/left-panel/modules/Data.vue'
import Bus from '@/utils/eventBus'

describe("Data.vue-数据组件", ()=>{
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    let wrapper = shallowMount(Data,{
        i18n,
        propsData:{
            dataList:[]
        }
    });

    it("addApiData-添加Api数据",()=>{
        Bus.$emit = jest.fn()
        wrapper.vm.addApiData();
        expect(Bus.$emit.mock.calls[0][2].path).toBe("left-panel/liveData/LiveDataForApi");
    });
    it('测试addDataList添加数据',()=>{
        let data = {
            fileName:'Campus公交站点',
            id:'1235689134',
            type:'JSON'
        }
        wrapper.vm.addDataList(data);
        wrapper.vm.getDataContentUrl(data.id)
        expect(wrapper.vm.getDataContentUrl(data.id)).toBe('http://www.supermapol.com/web/datas/1235689134/content.json')
    })
    it('搜索过滤数据searchFilter测试',()=>{
        let val = '公交';
        wrapper.vm.searchFilter(val);
        expect(wrapper.vm.keywords.text).toBe('公交')
        expect(wrapper.vm.keywords.saveTimeOut).toBe(7)
        wrapper.vm.getRequestData(2);
        expect(wrapper.vm.currentPage).toBe(2);
    })
});