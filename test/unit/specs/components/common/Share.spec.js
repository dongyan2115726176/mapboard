import util from '../../../TestUtil'
import { shallowMount } from '@vue/test-utils'
import Share from '@/components/common/Share'
import Bus from '@/utils/eventBus'

describe('Share.vue-分享组件测试', () => {
    let i18n = util.i18n;
    let appConfig = util.appConfig;
    const wrapper = shallowMount(Share,{
        propsData:{
            needParams: {
                authorizeSetting:''
            }
        },
        i18n
    });
    it("initPublicShareState-初始化公开当前权限是否正确",()=>{
        let userState = "READ";
        wrapper.vm.initPublicShareState(userState);
        expect(wrapper.vm.publicUserStateArr).toEqual([true,true,false])
            userState = "READWRITE";
        wrapper.vm.initPublicShareState(userState);    
        expect(wrapper.vm.publicUserStateArr).toEqual([true,true,true])
    })
    it("onPublicUserStateChange- 公开权限修改是否修改成功",()=>{
        //index === 0 
        let index = 0;
        wrapper.setData({
            publicUserStateArr:[false,false,false]
        })
        wrapper.vm.onPublicUserStateChange(index);
        expect(wrapper.vm.publicUserState).toBe("PERSONAL")
        //index === 1
        index = 1;
        wrapper.vm.onPublicUserStateChange(index);
        expect(wrapper.vm.publicUserState).toBe("SEARCH")
        //index === 2
        index = 2;
        wrapper.vm.onPublicUserStateChange(index);
        expect(wrapper.vm.publicUserState).toBe("READ")
        wrapper.setData({
            publicUserStateArr:[true,true,true]
        })
        wrapper.vm.onPublicUserStateChange(index);  
        expect(wrapper.vm.publicUserState).toBe("READWRITE")
    })
})