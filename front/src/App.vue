<template>
  <router-view></router-view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  beforeDestroy() {
    this.resetLocalStorage();
  },
  destroyed() {
    this.resetLocalStorage();
  },

  created() {
    // this.axios.get("http://ip-api.com/json").then(response => {
    //   
    // });
    this.$socket.on("coronaData", data => {
      //console.log("start", data.coronaData[0].data);
      // console.log(data);
      this.resetLocalStorage();
      this.setCoronaDay(data.accumulateData);
      this.setData(data.coronaData);
      //console.log(data.coronaData);
    });
    this.$socket.on("localData", data => {
      this.resetLocalStorage();
      this.setLocalData(data);
    });

    this.$socket.on("foreignData", data => {
      this.resetLocalStorage();
      //console.log(data);
      this.setForeignData(data);
    });

    this.$socket.on("localImage", data => {
      this.setLocalMap(data);
    });
  },
  methods: {
    ...mapMutations([
      "setData",
      "setCoronaDay",
      "setForeignData",
      "setLocalData",
      "resetLocalStorage",
      "setLocalMap"
    ])
  }
};
</script>
<style lang="scss">
.text-white {
  color: white;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: rgb(141, 138, 138);
}
.md-card .md-card-header .ct-label {
  color: rgb(255, 255, 255);
  font-weight: 400;
}
.md-table-head-label {
  font-weight: 400 !important;
}
.content {
  min-height: calc(100vh - 152px) !important;
}
.title,
.category,
.stats {
  font-weight: 400 !important;
}
.md-table-cell-container {
  font-weight: 400 !important;
}
.md-title {
  font-size: 30px !important;
}
</style>
