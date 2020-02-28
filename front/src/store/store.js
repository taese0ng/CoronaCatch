import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    // 상태
    state: {
        corona_data:0,
        date:0,
    },
    // Getter
    getters: {
        getData(state){
            return state.corona_data;
        },
        getDate(state){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var date = date.getDate();
            state.date = year + '/' + month + '/' + date;
            return state.date;
        }
    },
    // Method
    mutations: {
        setData(state, data){
            state.corona_data = data;
            console.log(state.corona_data);
        }
    },
    // Actions
    actions: {
    }
})