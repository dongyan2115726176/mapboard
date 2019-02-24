<template>
    <div class="auxiliary-line">
        <div 
            id="auxiliary-xline"
            :style="'top:' + xTop"
            v-show="isShow"
        >
        </div>
        <div
            id="auxiliary-yline"
            :style="'left:' + yLeft"
            v-show="isShow"
        >
        </div>
    </div>
</template>

<script>
    import Bus from '../../utils/eventBus';
    export default {
        name:"AuxiliaryLine",
        data () {
            return {
                xTop:"0px",
                yLeft:"0px",
                isShow:false,
            };
        },
        created(){
            Bus.$on("widgets-auxiliary-line",(state,style)=>{
                this.isShow = state;
                if(state){
                    let {top,left} = style;
                    this.xTop = top+"px";
                    this.yLeft = left+"px";
                }
            })
        }
    }
</script>
<style scoped>
    #auxiliary-xline,#auxiliary-yline {
        content: " ";
        position: absolute;
        z-index: 9999;
    }
    #auxiliary-xline {
        left: 0px;
        width: 100%;
        height: 1px;
        border-top: 1px dashed #13A2FC;
    }
    #auxiliary-yline {
        top: 0px;
        width: 1px;
        height: 100%;
        border-left: 1px dashed #13A2FC;
    }
</style>