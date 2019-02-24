import util from '../../../../../TestUtil.js'
import {
    shallowMount
} from '@vue/test-utils'
import ImageSetting from '@/components/right-panel/widgets/other/ImageSetting.vue'
describe('测试右侧ImageSetting.vue', () => {
    let i18n = util.i18n;
    //默认的参数对象
    let imageParam = {
        title: "标题",
        nls: "image",
        icon: "md-icon-image",
        imgsrc: '',
        style: {
            top: "400px",
            left: "400px",
            width: "135px",
            height: "85px"
        }
    };
    let wrapper = shallowMount(ImageSetting, {
        i18n,
        propsData: {
            "param": imageParam
        }
    });
    it('imageParam-计算属性是否生效', () => {
        wrapper.setProps({
            param: {
                title: "改过的标题",
                imageSrc: "./../../../../../../../static/images/bicycle.png"
            }
        })
        expect(wrapper.vm.imageParam.title).toBe("改过的标题");
    })
    it('imgsrc添加上了', () => {
        expect(wrapper.vm.imageParam.imageSrc).toBe("./../../../../../../../static/images/bicycle.png");
    })
    it('uploadLogoFailed-上传失败', () => {
        wrapper.vm.$message = jest.fn();
        let errMsg = '401';
        wrapper.vm.uploadLogoFailed(errMsg);
        expect(wrapper.vm.$message.mock.calls[0][0].message).toBe('上传失败,登录状态已失效！')
        errMsg = '408';
        wrapper.vm.uploadLogoFailed(errMsg);
        expect(wrapper.vm.$message.mock.calls[1][0].message).toEqual('上传文件类型暂不支持！')
    })

})
