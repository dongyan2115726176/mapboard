<template>
    <vue-scrollbar
        class="dashBoard-scrollbar"
        ref="dashBoardScrollbar"
    >
        <div id="module-dashBoard" ref="moduleDashBoard">
            <div>
                <p class="f16">{{$t("addedComponents")}}：</p>
            </div>
            <i class="split-line"></i>
            <p v-if="!widgetLength" class="dashBoard-tips">{{$t("addComponents")}}！</p>
            <ul>
                <li
                    class="widget-item"
                    :class="{active: index == isActive}"
                    v-for="(item,index) in reverseWidgetList"
                    v-dragging="{item:item,list:reverseWidgetList,group:'reverseWidgetList'}"
                    :key="item.id"
                    @click.stop="toConfigureSelf(index)"
                >
                    <p class="item-name">
                        <i :class="item.icon" class="f14 f-left"></i>
                        <span class="f14 f-left ellipsis" :title="item.title">{{$t(item.nls)}}-{{(item.title)}}</span>
                    </p>
                    <i
                        class="md-icon-delete"
                        @click.stop="toDeleteSelf(index)"
                    >
                    </i>
                </li>
            </ul>
        </div>
    </vue-scrollbar>
</template>

<script>
    import Bus from "../../../utils/eventBus"
    import VueScrollbar from 'vue2-scrollbar' //滚动条组件
    export default {
        name:"DashBoard",
        data () {
            return {
                isActive:-1,// 根据索引激动当前高亮
            }
        },
        props: {
            widgetList: {
                type: Array,
                required: true
            }
        },
        components:{
            VueScrollbar
        },
        computed:{
            widgetLength(){
                return this.widgetList.length;
            },
            reverseWidgetList(){
                let reverseWidgetList = [];
                reverseWidgetList = this.widgetList.concat();
                reverseWidgetList.reverse();
                return reverseWidgetList;
            }
        },
        created () {
            // 重复监听Setting.vue中的Bus 用来激活当前高亮
            Bus.$on("dashBoard-active",(activeIndex) => {
                this.isActive = activeIndex;
            });

            // 在工具类chartDataUtil.js 中$emit 同步对应统计图数据
             Bus.$on("update-chartData", (param)=>{
                let {id} = param;
                let index = -1;
                for(let i=0;i<this.widgetList.length;i++){
                    if(this.widgetList[i].id === id){
                        index = i;
                    }
                }
                if(index === -1){return};
                this.widgetList.splice(index,1,param);
             });

             //utils工具类中，利用element提供信息提示功能
	        Bus.$on("message-utils", (type,msg)=> {
	           this.$message({
		           type: type,
		           message: msg
	           })
            });
        },
        mounted(){
            // 排序位置发生变化时
            this.$dragging.$on('dragged', ({value}) => {
                let widgetList = this.reverseWidgetList.slice();
                widgetList.reverse();
                Bus.$emit("update-widgetList",widgetList);
                Bus.$emit("toggle-settingPanel","");
            })
            // 绑定delete和删除组件
            document.onkeyup = (event)=>{
                if(this.isActive > -1 && event.key === "Delete"){
                    let index = this.widgetLength -1-this.isActive;
                    Bus.$emit("update-components",index);
                    Bus.$emit("toggle-settingPanel","");
                    this.scrollToTop();
                }
            }
        },
        methods: {
            // 配置自身组件
            toConfigureSelf (index) {
                let realIndex = this.widgetLength-1-index;
                let widgetParam = this.widgetList[realIndex];
                if(this.isActive === index){
                    this.isActive = -1;
                    Bus.$emit("toggle-settingPanel","");
                }else{
                    this.isActive = index;
                    // 在SettingPanel 组件中$on调用  切换对应的配置组件
                    Bus.$emit("toggle-settingPanel",widgetParam);
                }
            },

            // 删除自身组件
            toDeleteSelf (index) {
                // 在App 组件中$on调用 为应用添加或删除图表组件
                if(index === this.isActive){
                    // 当前无高亮 切换到大屏
                    this.isActive = -1;
                    Bus.$emit("toggle-settingPanel","");
                }else if(index < this.isActive){
                    // 减少一位索引，高亮不变 不切换到大屏
                    this.isActive = this.isActive -1;
                }
                let sliceIndex = this.widgetLength-1-index;
                Bus.$emit("update-components",sliceIndex);
                this.scrollToTop();
            },
            // 解决删除大屏列表 滚动条卡死的问题
            scrollToTop(){
                let top = this.$refs.dashBoardScrollbar.top;
                let scrollY = (top - 43);
                this.$refs.dashBoardScrollbar.scrollToY(scrollY);
            }
        }
    }
</script>
<style scoped>
    .dashBoard-scrollbar {
        height: calc(100% - 50px);
    }
    #module-dashBoard {
        padding-right: 20px;
        padding-top: 19px;
    }
    .widget-item {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 24px;
        cursor: pointer;
    }
    .widget-item.dragging {
        border-bottom:1px solid #13A2FC;
    }
    .dashBoard-tips {
        text-align: center;
    }
    .md-icon-setting {
        font-size:14px;
    }
    .widget-item > i {
        cursor: pointer;
        margin-top: 3px;
        color: #5D636A;
    }
    .widget-item > i:hover {
        color: #BDC9D4;
    }
   .item-name {
       flex: 4;
   }
   .item-name > i {
       width: 20px;
       height: 19px;
       margin-right: 10px;
       line-height: 18px;
   }
   .item-name > span {
       font-family: MicrosoftYaHei;
       font-size: 14px;
       line-height: 19px;
   }
   .widget-item.active > .item-name {
        color: #13A2FC;
    }
   .item-drag {
       flex: 1;
   }
   .f-left {
	   float: left;
   }
	.ellipsis {
		display: block;
		max-width: 168px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
<style>
    .split-line {
        display: block;
        width: 100%;
        border-top:1px solid #272F3A;
        margin:20px 0;
    }
    .vdr-stick {
        z-index: 9999;
    }
    .hight-light-active {
        border: 1px solid #409EFF;
    }
    .vue-scrollbar__wrapper {
        background-color: #1B1F24;
    }
</style>
