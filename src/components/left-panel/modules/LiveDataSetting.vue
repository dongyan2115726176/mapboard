<template>
    <div id="live-data-setting">
        <div class="data-type">
            <span class="list-title">{{$t("dataSourceType")}}</span>
            <el-select
                v-model="dataSources"
                :placeholder="$t('choose')"
                size="small"
                class="list-size"
                @change="selectDataSources(dataSources)"
            >
                <el-option
                    v-for="item in dataSourcesOptions"
                    :key="item.type"
                    :label="item.label"
                    :value="item.type"
                >
                </el-option>
            </el-select>
        </div>
        <LiveDataForDataflow
            v-if="showServer[0]" 
            :baseSetting="needParams"
        />
    </div>
</template>

<script>
import LiveDataForDataflow from "../liveData/LiveDataForDataflow"
export default {
    name: "LiveDataSetting",
    data () {
        return {
            dataSources:"dataFlow", // 当前数据类型
            dataSourcesOptions:[   // 数据类型
                {type:"dataFlow",label:this.$t("dataFlow")},
                // {type:"server",label:this.$t("service")},
                // {type:"api",label:"API型"},
                // {type:"file",label:this.$t("file")},
            ],
            showServer:[true,false,false,false], // 默认显示服务型组件
        }
    },
    props:{
        needParams:{
            type:Object,
            required:true
        }
    },
    components:{
        LiveDataForDataflow
    },
    methods:{
        selectDataSources(dataSources){
            for(let i=0;i<this.dataSourcesOptions.length;i++){
                if(this.dataSourcesOptions[i].type === dataSources){
                    this.showServer = [false,false,false];
                    this.showServer[i] = true;
                    break;
                }
            }
        }
    }
}
</script>

<style scoped>
    #live-data-setting {
        width: 640px;
    }
    .data-type {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .list-title {
        display: block;
        line-height: 36px;
    }
    .list-size {
        width: 450px;
    }
</style>
<style>

</style>
