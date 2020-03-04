<template>
  <router-view></router-view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  created() {
    this.$socket.on("coronaData", data => {
      this.setCoronaDay(data.accumulateData);
      this.setData(data.coronaData);
      this.setForeignData(data.foreignData);
    }),
      this.$socket.on("areaData", data => {
        this.setLocalData(data);
      });
  },
  methods: {
    ...mapMutations([
      "setData",
      "setCoronaDay",
      "setForeignData",
      "setLocalData"
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
