import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
    appScale:{   // container中间缩放比例
        x:1,
        y:1
    }
}

const mutations = {
    upDateAppScale(state,payload){
        state.appScale = payload;
    }
}

const store = new Vuex.Store({
    state: state,
    mutations: mutations
})
// state: {} | func,   // 根state对象，初始数据或状态赋值
// mutations: {},      // 纯函数修改数据的方法，处理函数总是接受 state 作为第一个，payload 作为第二个参数(可选)
// actions: {},        // 事件，动作， 处理函数总是接受 context 作为第一个参数，payload 作为第二个参数（可选）。
// getters: {},        // store 的计算属性，返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会被重新计算
// modules: {},        // 包含子模块的对象，会被合并到 store
// plugins: [],        // 包含应用在store上的插件方法，这些插件接受store作为唯一参数，可以监听 mutation(用于外部地数据持久化、记录或调试)或者提交 mutation(用于内部数据，例如 websocket 或 某些观察者)
// strict: Boolean,    // 默认值：false, 使Vuex store进入严格模式，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误。

export default store;