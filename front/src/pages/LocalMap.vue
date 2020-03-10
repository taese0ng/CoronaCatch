<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">코로나19 현황 지도</h4>
            <p class="category">코로나19 국내 현황 지도</p>
          </md-card-header>
          <md-card-content>
            <img :src="this.getLocalMap" />
            <h4>출처 - 네이버 -</h4>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getLocalMap"])
  }
};
</script>

<style scoped>
* {
  font-weight: 400;
}
</style>
