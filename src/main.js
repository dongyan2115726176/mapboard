// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'
import App from './App'
import store from "./vuex/store.js"
import Axios from 'axios'
import VueDND from 'awe-dnd'
import VueI18n from 'vue-i18n'
import VueDraggableResizable from "./components/common/VueDraggableResizable.vue"
if (window.lang === "en-US"){
    Vue.use(Element, { locale ,size: 'mini' })
}else {
    Vue.use(Element, {  size: 'mini' })
}

Vue.use(VueDND)
Vue.use(VueI18n)
Vue.component("VueDraggableResizable",VueDraggableResizable)
Vue.config.productionTip = false
Vue.prototype.$http = Axios // 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等
window.chartData = {};
const i18n = new VueI18n({
  locale : window.lang, //当前语言标识
  messages : {
    [window.lang] : window.locales
  }
})

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
