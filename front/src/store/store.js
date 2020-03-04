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
               series: [[]]
             },
             data2: {
               labels: [],
               series: [[], []]
             },
             options: {
               low: 0,
               high: "",
               showArea: true,
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
             options2: {
               low: 0,
               high: "",
               showArea: true,
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
             data2: {
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
           localData: {time:"", data:[]},
           prevention_img:[
             {
               id: 1,
               image: require("@/assets/img/prevention_1.png")
             },
             {
               id: 2,
               image: require("@/assets/img/prevention_2.png")
             },
             {
               id: 3,
               image: require("@/assets/img/prevention_3.png")
             },
             {
               id: 4,
               image: require("@/assets/img/prevention_4.png")
             },
             {
               id: 5,
               image: require("@/assets/img/prevention_5.png")
             },
             {
               id: 6,
               image: require("@/assets/img/prevention_6.png")
             },
             {
               id: 7,
               image: require("@/assets/img/prevention_7.jpeg")
             },
           ]
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
            var local = state.localData.data;
            var data = {time:"", data:[]};
            var i;
            for(i=1; i<local.length; i++){
              data.data.push({
                id: i,
                지역: local[i].area,
                확진자: local[i].confirm,
                사망자: local[i].die,
                일일검사수: local[i].check,
                전일대비확진환자증감: local[i].increase
              })
            }
            data.data.push({
              id: i,
              지역: local[0].area,
              확진자: local[0].confirm,
              사망자: local[0].die,
              일일검사수: local[0].check,
              전일대비확진환자증감: local[0].increase
            });
            data.time = state.localData.time;
            console.log("time", data.time);
            return data;
           },
           getPrevention(state){
             return state.prevention_img;
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
               state.lineChart.data2.labels[i] =
                 state.corona_day[index + i].date;
               state.lineChart.data.series[0][i] =
                 state.corona_day[index + i].confirm;
               state.lineChart.data2.series[0][i] =
                 state.corona_day[index + i].unlock;
               state.lineChart.data2.series[1][i] =
                 state.corona_day[index + i].die;
             }

             maxNum.push(Math.max.apply(null, state.lineChart.data2.series[0]));
             maxNum.push(Math.max.apply(null, state.lineChart.data2.series[1]));
             state.lineChart.options.high = Math.max.apply(null, state.lineChart.data.series[0]);
             state.lineChart.options2.high = Math.max.apply(null, maxNum);
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
               state.barChart.data.labels[i] = foreign[i + 2].country;
               state.barChart.data.series[0][i] = foreign[i + 2].confirm;
             }

             sortingField = "die";
             foreign.sort(function(a, b) {
               return b[sortingField] - a[sortingField];
             });

             for (var i = 0; i < 7; i++) {
               state.barChart.data2.labels[i] = foreign[i + 2].country;
               state.barChart.data2.series[1][i] = foreign[i + 2].die;
             }
             console.log("정렬된 국가");
             console.log(foreign);
           },
           setLocalData(state, data){
             console.log("ddd", data);
             var local = data.data;
             var sortingField = 'confirm';
             local.sort(function(a,b){
               return b[sortingField] - a[sortingField];
             });
             state.localData.time = data.time;
             state.localData.data = local;
           },
         },
         // Actions
         actions: {},
         // Plugins
         plugins: [vuexLocalStorage.plugin]
       });