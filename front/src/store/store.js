import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from 'vuex-persist'; //npm install vuex-persist --save

Vue.use(Vuex);

const badMutations = ['someMutationThatGetsCalledTooOften']

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  filter: mutation => (badMutations.indexOf(mutation.type) === -1) //Boolean
  /*
  reducer: state => ({
    keepThisModule: state.keepThisModule,
    keepThisModuleToo: state.keepThisModuleToo,
  })
  */
})

export const store = new Vuex.Store({
         // state
         state: {
           corona_data: [],
           date: 0,
           corona_day: [],
           lineChart: {
             data: {
               labels: [],
               series: [[], [], []]
             },
             options: {
               low: 0,
               high: "",
               showArea: false,
               height: "245px",
               axisX: {
                 showGrid: false
               },
               lineSmooth: true,
               showLine: true,
               showPoint: true,
               fullWidth: true,
               chartPadding: {
                 right: 50
               }
             },
             responsiveOptions: [
               [
                 "screen and (max-width: 640px)",
                 {
                   axisX: {
                     labelInterpolationFnc(value) {
                       return value[0];
                     }
                   }
                 }
               ]
             ]
           },
           barChart: {
             data: {
               labels: [],
               series: [[], []]
             },
             options: {
               seriesBarDistance: 10,
               axisX: {
                 showGrid: false
               },
               height: "245px"
             },
             responsiveOptions: [
               [
                 "screen and (max-width: 640px)",
                 {
                   seriesBarDistance: 5,
                   axisX: {
                     labelInterpolationFnc(value) {
                       return value[0];
                     }
                   }
                 }
               ]
             ]
           },
           foreignData: [],
           localData: []
         },
         // Getter
         getters: {
           getData(state) {
             return state.corona_data;
           },
           getDate(state) {
             var date = new Date();
             var year = date.getFullYear();
             var month = date.getMonth() + 1;
             var date = date.getDate();
             state.date = year + "/" + month + "/" + date;
             return state.date;
           },
           getlineChartData(state) {
             return state.lineChart;
           },
           getbarChartData(state) {
             return state.barChart;
           },
           getForeignData(state) {
             var foreign = state.foreignData;
             var data = [];
             var i;
             for(i=1; i<foreign.length; i++){
               data.push({
                 id: i,
                 국가: foreign[i].country,
                 확진자: foreign[i].confirm,
                 사망자: foreign[i].die
               });
             }
             data.push({
               id: i,
               국가: "총합",
               확진자: foreign[0].confirm,
               사망자: foreign[0].die
             });
             return data;
           },
           getLocalData(state){
            var local = state.localData;
            var data = [];
            var i;
            for(i=1; i<local.length; i++){
              data.push({
                id: i,
                지역: local[i].area,
                확진자: local[i].confirm,
                격리해제: local[i].unlock,
                사망자: local[i].die,
                검사인원: local[i].check
              })
            }
            data.push({
              id: i,
              지역: local[0].area,
              확진자: local[0].confirm,
              격리해제: local[0].unlock,
              사망자: local[0].die,
              검사인원: local[0].check
            });
            return data;
           }
         },
         // Method
         mutations: {
           setData(state, data) {
             state.corona_data = data;
           },
           setCoronaDay(state, data) {
             state.corona_day = data;
             var index = state.corona_day.length - 7;
             var maxNum = [];
             for (var i = 0; i < 7; i++) {
               state.lineChart.data.labels[i] =
                 state.corona_day[index + i].date;
               state.lineChart.data.series[0][i] =
                 state.corona_day[index + i].unlock;
               state.lineChart.data.series[1][i] =
                 state.corona_day[index + i].die;
               state.lineChart.data.series[2][i] =
                 state.corona_day[index + i].confirm;
             }

             maxNum.push(Math.max.apply(null, state.lineChart.data.series[2]));
             maxNum.push(Math.max.apply(null, state.lineChart.data.series[0]));
             maxNum.push(Math.max.apply(null, state.lineChart.data.series[1]));
             state.lineChart.options.high = Math.max.apply(null, maxNum);
           },
           setForeignData(state, data) {
             var foreign = data;
             var korea = { country: "한국", confirm: 0, die: 0 };
             korea.confirm = String(state.corona_data[0].data);
             korea.die = String(state.corona_data[2].data);
             foreign.push(korea);
             var sortingField = "confirm";
             foreign.sort(function(a, b) {
               return b[sortingField] - a[sortingField];
             });
             state.foreignData = foreign;
             for (var i = 0; i < 7; i++) {
               state.barChart.data.labels[i] = foreign[i+2].country;
               state.barChart.data.series[0][i] = foreign[i+2].confirm;
               state.barChart.data.series[1][i] = foreign[i+2].die;
             }
             console.log("정렬된 국가");
             console.log(foreign);
           },
           setLocalData(state,data){
             var local = data;
             var sortingField = 'confirm';
             local.sort(function(a,b){
               return b[sortingField] - a[sortingField];
             });
             state.localData = local;
           }
         },
         // Actions
         actions: {},
         // Plugins
         plugins: [vuexLocalStorage.plugin]
       });