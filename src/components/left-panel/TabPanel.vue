<script>
    export default {
        name: "TabPanel",
        props: {
            item: {
                type: Object,
                required: true
            },
            widgetList: {
                type: Array,
                required: true
            },
            dataList:{
                type: Array,
                required: true
            },
            baseSetting:{
                type: Object,
                required: true
            }
        },
        render  (h) {
            let component=require('./modules/'+this.item.component);
            return h(component.default,{props:{dataList:this.dataList,baseSetting:this.baseSetting,widgetList:this.widgetList}});
        }
    }
</script>