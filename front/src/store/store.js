import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    // state
    state: {
        corona_data: [{ title: 0, data: 0 }, { title: 0, data: 0 }, { title: 0, data: 0 }, { title: 0, data: 0 }],
        date:0,
        corona_day:[],
        lineChart : {
            data: {
                labels: [0, 0, 0, 0, 0, 0, 0],
                series: [
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]
                ]
            },
            options: {
                low: 0,
                high: 3000,
                showArea: false,
                height: '245px',
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
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc(value) {
                            return value[0]
                        }
                    }
                }]
            ]
        }
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
        },
        getlineChartData(state){
            return state.lineChart;
        }
    },
    // Method
    mutations: {
        setData(state, data){
            state.corona_data = data;
            console.log(state.corona_data);
        },
        setCoronaDay(state, data){
            state.corona_day = data;
            var index = state.corona_day.length - 7;
            var maxNum = [];
            for (var i = 0; i < 7; i++) {
                state.lineChart.data.labels[i] = state.corona_day[index + i].date;
                state.lineChart.data.series[2][i] = state.corona_day[index + i].confirm;
            }
            
            maxNum.push(Math.max.apply(null, state.lineChart.data.series[2]));
            maxNum.push(Math.max.apply(null, state.lineChart.data.series[0]));
            maxNum.push(Math.max.apply(null, state.lineChart.data.series[1]));
            state.lineChart.options.high = Math.max.apply(null, maxNum);
            console.log(state.lineChart.options.high);
            console.log(data);
        }
    },
    // Actions
    actions: {
    }
})