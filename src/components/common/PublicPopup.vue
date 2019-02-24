<script>
    export default {
        name:"PublicPopup",
        data () {
            return {

            }
        },
        props:{
            showPopup:{
                type: Boolean,
                required: true
            },
            popupParams:{
                type: Object,
                required: true
            }
        },
        methods: {
            hidePopup(){
                // 关闭弹窗
                this.$emit("update:showPopup",false);
            },
            // 阻止冒泡
            stopPropagation(ev){
                if(window.event){
                    window.event.cancelBubble = true;
                }else{
                    ev.stopPropagation();
                }
            }
        },
        render:function(h){
            let {path,title,params} = this.popupParams;
            let needParams = {};
            if(params){
                needParams = params;
            }
            let component = (h(require("../"+path+".vue").default,{ props:{needParams:needParams} }))
            return(
                <div id="public-popup" onClick={this.hidePopup}>
                    <div class="popup-message-box" onClick={this.stopPropagation}>
                        <div class="popup-message-box-header">
                            <div class="popup-message-box-title">
                                <span>{title}</span>
                            </div>
                            <button type="button" class="popup-message-box-headerbtn" onClick={this.hidePopup}>
                                <i class="md-icon-close"></i>
                            </button>
                        </div>
                        <div class="popup-message-box-content">
                            {component}
                        </div>
                    </div>
                </div>
            )
        }
    }
</script>

<style scoped>
    #public-popup {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        background-color: rgba(0,0,0,0);
        z-index: 1000;
    }
    #public-popup::after {
        content: "";
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
    }
    .popup-message-box {
        display: inline-block;
        min-width: 360px;
        vertical-align: middle;
        font-size: 18px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        text-align: left;
        backface-visibility: hidden;
    }
    .popup-message-box-header {
        position: relative;
	    border-radius: 5px 5px 0 0;
        padding: 14px 15px 10px;
        background-color: #0E1013;
        border-bottom: 1px solid #21262D;
        color:  #BDCBD5;
    }
    .popup-message-box-title {
        padding-left: 0;
        margin-bottom: 0;
        font-size: 14px;
        line-height: 1;
    }
    .popup-message-box-headerbtn {
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 0;
        border: none;
        outline: 0;
        background: 0 0;
        font-size: 12px;
        cursor: pointer;
        color:  #BDCBD5;
    }
    .popup-message-box-headerbtn > .mapuse-icon-close {
        font-weight: bolder;
    }
    .popup-message-box-content {
        position: relative;
        padding: 10px 15px;
        font-size: 14px;
        border-radius:  0 0 5px 5px;
        color: #BDCBD5;
        background-color:#1B1F24;
    }
</style>
