<template>
    <div id="module-other">
        <p class="f16">{{$t("otherType")}}：</p>
        <i class="split-line"></i>
        <div class="other-content">
            <div
                v-for="(item,index) in otherOption"
                :key="index"
                class="other-list"
                :draggable="true"
                @dragstart="onDragStart"
                @click="selectOther(item.value)"
            >
                <div class="other-list-img">
                    <img :src="item.img" alt="">
                </div>
                <span class="other-list-title">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from '../../../utils/eventBus';
    import bImage from '../../../assets/images/bImage.png';
    export default {
        name: "Other",
        data() {
            return {
                otherOption: [ // 选择指标列表
                    {img: bImage, name: this.$t("image"),value:"img"}
                ]
            }
        },
        methods: {
            // 选择其他组件的哪一项
            selectOther(name) {
                switch (name){
                    case "img":
                    this.initImageParams();
                    break;
                }
            },
            // 拖拽开始事件
            onDragStart(e){
                this.initImageParams(true);
            },
            // 初始化自定义图片组件
            initImageParams(isDrag){
                let imageParam ={
                    type: "Image",
                    title: this.$t("headline"),
                    nls: "image",
                    icon: "md-icon-image",
                    id: new Date().getTime(),
                    imageSrc:"",
                    style: {
                        top: "400px",
                        left: "800px",
                        width: "135px",
                        height: "85px"
                    }
                }
                if(isDrag){
                    Bus.$emit("widgetDrag-mid",imageParam);
                    return;
                }
                // 在App 组件中$on调用 为应用添加默认图表组件
                Bus.$emit("update-components",imageParam);
            }
        }
    }

</script>
<style scoped>
    #module-other {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        padding-right: 20px;
        padding-top: 19px;
    }
    .other-content {
        display: flex;
        display: -webkit-flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .other-list {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .other-list-icon {
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        font-size: 80px;
    }
    .other-list-title {
        text-align: center;
        font-size:13px;
    }
    .other-list-img {
        width: 96px;
        height: 70px;
        margin-bottom: 10px;
        background-color: #292A2F;
    }
    .other-list-img:hover{
        border: 1px solid #0295dc;
    }
    .other-list-img > img {
        display: block;
        width: 94px;
        height: 68px;
    }
</style>
