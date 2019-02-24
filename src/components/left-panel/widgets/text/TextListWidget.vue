<template>
  <div class="textList-widget">
    <div class="header">
      <div class="headerContent">
        <p
          v-for="(item,index) in textListParams.headTitle"
          :key="index"
          style="color:#333;font-size:20px;background:skyblue"
        >{{item}}</p>
      </div>
    </div>
    <div class="animate" :style="textListParams.numStyle">
      <div
        class="bodyContent nwwest-roll"
        ref="rollul"
        :style="textListParams.tableStyle"
        :class="{anim:animate===true}"
      >
        <div :key="index" v-for="(item,index) in animateContent" :style="textListParams.rowStyle">
          <p
            v-for="(items,index2) in item"
            :key="index2"
            :style="textListParams.LineHeight"
          >{{items}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "../../../../utils/eventBus";
import { setInterval, setTimeout, clearInterval, clearTimeout } from "timers";
import ChartDataUtil from "../../../../utils/chartDataUtil";
import CommonUtil from "../../../../utils/commonUtil";
let animateContentData = [
  { key0: "test0" },
  { key1: "test1" },
  { key2: "test2" },
  { key3: "test3" },
  { key4: "test4" },
  { key5: "test5" },
  { key6: "test6" },
  { key7: "test7" },
  { key8: "test8" },
  { key9: "test9" }
];
export default {
  name: "TextListWidget",
  data() {
    return {
      animate: true,
      animateContent: animateContentData, //[],
      saveTimeout: {
        startInter: null,
        animateTimeout: null
      },
      topPosition: 0
    };
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  created() {
    if (this.param.dataSource === "示范数据") {
      this.param.headTitle = [];
      this.param.content = [];
    }

    // 接收大屏的主题样式 来设置颜色系列
    Bus.$on("theme-change", (themePlan, isInit) => {
      if (isInit) {
        return;
      }
      let { indicator } = themePlan;
      this.param.fontColor = indicator.body;
      this.param.titleColor = indicator.title;
    });
  },
  mounted() {
    this.showAnimate();
  },
  computed: {
    textListParams() {
      let {
        fontSize,
        fontColor,
        dataSource,
        headTitle,
        content,
        style,
        textListParam: { dataRows }
      } = this.param;
      let numStyle = {
        fontSize: fontSize,
        color: fontColor,
        height: style.height.substr(0, style.height.length - 2) - 65 + "px"
      };
      let tableStyle = { width: style.width };
      // console.log(tableStyle)
      let rowStyle = numStyle.height;
      rowStyle = rowStyle.substr(0, rowStyle.length - 2);
      rowStyle = rowStyle / dataRows;
      let LineHeight = { lineHeight: rowStyle + "px" };
      rowStyle = { height: rowStyle + "px" };
      // this.animateContent = content.concat();
      if (this.param.textListParam.refreshMethod == "逐条滚动") {
        if (content.length > 2) {
          this.showAnimate();
        }
      } else {
      }
      return {
        numStyle,
        tableStyle,
        rowStyle,
        LineHeight,
        dataSource,
        headTitle,
        content,
        dataRows
      };
    }
  },
  destroyed() {
    this.clearTime();
  },
  methods: {
    clearTime() {
      clearInterval(this.saveTimeout.startInter);
      clearInterval(this.saveTimeout.animateSettime);
    },
    meanwhile(){
      this.clearTime();
      let position = 0;
          let con1 = this.$refs.rollul;

      this.saveTimeout.startInter = setInterval(() => {
        this.animate = true;
        if(position>88){
          let head = JSON.parse(JSON.stringify(this.animateContent[0]));
          this.animateContent.push(head);
          this.animateContent.shift();
          position = 0;
          this.animate = false;
          con1.style.marginTop = "-"+position+"px";
        }
     
    
        position = position+11
        con1.style.marginTop = "-"+position+"px";
   
        //con1.style.opacity = "1";
        //this.animate = !this.animate;

        // setTimeout(() => {
        //   this.animateContent.push(head);
        //   this.animateContent.shift();
        //   con1.style.marginTop = "-87px";
        //   //con1.style.opacity = "0";
        //   this.animate = !this.animate;
        // }, 0);
      },100);

    },
    ItemByItem(){
      this.clearTime();
      this.saveTimeout.startInter = setInterval(() => {
        let head = JSON.parse(JSON.stringify(this.animateContent[0]));
        let con1 = this.$refs.rollul;

        con1.style.marginTop = "0";
        //con1.style.opacity = "1";
        this.animate = !this.animate;

        setTimeout(() => {
          this.animateContent.push(head);
          this.animateContent.shift();
          con1.style.marginTop = "-87px";
          //con1.style.opacity = "0";
          this.animate = !this.animate;
        }, 0);
      }, this.param.textListParam.frequency * 1000);

    },
    showAnimate() {
      //this.ItemByItem();
       this.meanwhile()


    }
  }
};
</script>

<style scoped>
.textList-widget {
  width: 100%;
  height: 100%;
}
.header {
  height: 65px;
  line-height: 65px;
}
.animate {
  background: #fff;
  overflow: hidden;
  position: relative;
}
.bodyContent {
  position: absolute;
}
.bodyContent div {
  width: 100%;
  height: 5vh;
  display: flex;
}
.bodyContent div p {
  border: 1px solid;
  text-align: center;
  flex: 1;
}
.headerContent {
  display: flex;
}
.headerContent p {
  text-align: center;
  border: 1px solid;
  flex: 1;
  height: 65px;
  display: block;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.flip-list-move {
  transition: transform 1s;
}
/* 
.newest-bill .nwwest-roll {
    padding-left: 15px;
    height: 210px;
    margin: 10px auto;
    overflow: hidden;
     transition: all 0.5s;
} */

.anim {
  transition: margin-top 0.5s;
}
</style>
