import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist"; //npm install vuex-persist --save

Vue.use(Vuex);
const badMutations = ["someMutationThatGetsCalledTooOften"];

const vuexLocalStorage = new VuexPersist({
  key: "test",
  storage: window.localStorage,
  filter: mutation => badMutations.indexOf(mutation.type) === -1 //Boolean
  /*
  reducer: state => ({
    keepThisModule: state.keepThisModule,
    keepThisModuleToo: state.keepThisModuleToo,
  })
  */
});

export const store = new Vuex.Store({
  // state
  state: {
    corona_data: [],
    date: 0,
    corona_day: [],
    localCoronaChart: {
      data: {
        labels: [],
        series: [[]]
      },
      data2: {
        labels: [],
        series: [[], []]
      },
      options: {
        lineSmooth: 0,
        low: 0,
        high: "", // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 5,
          bottom: -10,
          left: 20
        }
      },
      options2: {
        lineSmooth: 0,
        low: 0,
        high: "", // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 5,
          bottom: -10,
          left: 20
        }
      }
    },
    foreignCoronaChart: {
      data: {
        labels: [],
        series: [[]]
      },
      data2: {
        labels: [],
        series: [[]]
      }
    },
    foreignData: [],
    localData: { time: "", data: [] },
    prevention_img: [
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
      }
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
    getlocalCoronaChartData(state) {
      return state.localCoronaChart;
    },
    getforeignCoronaChartData(state) {
      return state.foreignCoronaChart;
    },
    getForeignData(state) {
      var foreign = state.foreignData;
      var data = [];
      var i;
      for (i = 1; i < foreign.length; i++) {
        data.push({
          id: i,
          country: foreign[i].country,
          confirm: foreign[i].confirm,
          die: foreign[i].die
        });
      }
      data.push({
        id: i,
        country: "총합",
        confirm: foreign[0].confirm,
        die: foreign[0].die
      });
      return data;
    },
    getLocalData(state) {
      var local = state.localData.data;
      var data = { time: "", data: [] };
      var i;
      for (i = 1; i < local.length; i++) {
        data.data.push({
          id: i,
          area: local[i].area,
          confirm: local[i].confirm,
          die: local[i].die,
          check: local[i].check,
          increase: local[i].increase
        });
      }
      data.data.push({
        id: i,
        area: local[0].area,
        confirm: local[0].confirm,
        die: local[0].die,
        check: local[0].check,
        increase: local[0].increase
      });
      data.time = state.localData.time;
      return data;
    },
    getPrevention(state) {
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
        state.localCoronaChart.data.labels[i] =
          state.corona_day[index + i].date;
        state.localCoronaChart.data2.labels[i] =
          state.corona_day[index + i].date;
        state.localCoronaChart.data.series[0][i] =
          state.corona_day[index + i].confirm;
        state.localCoronaChart.data2.series[0][i] =
          state.corona_day[index + i].unlock;
        state.localCoronaChart.data2.series[1][i] =
          state.corona_day[index + i].die;
      }

      maxNum.push(Math.max.apply(null, state.localCoronaChart.data2.series[0]));
      maxNum.push(Math.max.apply(null, state.localCoronaChart.data2.series[1]));
      state.localCoronaChart.options.high = Math.max.apply(
        null,
        state.localCoronaChart.data.series[0]
      );
      state.localCoronaChart.options2.high = Math.max.apply(null, maxNum);
    },
    setForeignData(state, data) {
      var foreign = data;
      var korea = { country: "한국", confirm: 0, die: 0 };
      korea.confirm = String(state.corona_data[0].data);
      korea.die = String(state.corona_data[2].data);
      foreign.push(korea);

      var sortingField = "die";
      foreign.sort(function(a, b) {
        return b[sortingField] - a[sortingField];
      });

      for (var i = 0; i < 7; i++) {
        state.foreignCoronaChart.data2.labels[i] = foreign[i + 2].country;
        state.foreignCoronaChart.data2.series[0][i] = foreign[i + 2].die;
      }

      sortingField = "confirm";
      foreign.sort(function(a, b) {
        return b[sortingField] - a[sortingField];
      });
      state.foreignData = foreign;

      for (var i = 0; i < 7; i++) {
        state.foreignCoronaChart.data.labels[i] = foreign[i + 2].country;
        state.foreignCoronaChart.data.series[0][i] = foreign[i + 2].confirm;
      }
    },
    setLocalData(state, data) {
      var local = data.data;
      var sortingField = "confirm";
      local.sort(function(a, b) {
        return b[sortingField] - a[sortingField];
      });
      state.localData.time = data.time;
      state.localData.data = local;
    }
  },
  // Actions
  actions: {},
  // Plugins
  plugins: [vuexLocalStorage.plugin]
});
