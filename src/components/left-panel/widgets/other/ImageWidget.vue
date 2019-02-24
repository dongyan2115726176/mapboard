<template>
    <div class="image-widget">
        <img :src="imageSrc" alt="">
    </div>
</template>

<script>
import defaultImg from '../../../../assets/images/bImage.png';
export default {
    name: "ImageWidget",
    data(){
        return {

        }
    },
    props:{
        param:{
            type: Object,
            required: true
        }
    },
    computed: {
        imageSrc(){
            let {imageSrc} = this.param;
            if(imageSrc === ""){
                imageSrc = defaultImg;
            }else if(imageSrc.indexOf("images/template/") !== -1){
                imageSrc = window.MD.hrefHead+"/apps/static/mapdashboard/"+imageSrc;
            }
            return imageSrc;
        }
    },
    methods: {

    }
}
</script>

<style scoped>
    .image-widget {
        width: 100%;
        height: 100%;
    }
    .image-widget > img {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>


