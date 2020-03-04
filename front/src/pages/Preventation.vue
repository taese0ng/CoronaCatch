<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">예방수칙</h4>
            <p class="category">코로나19 예방수칙</p>
          </md-card-header>
          <md-card-content>
            <div class="image">
              <img
                v-for="prevention in this.getPrevention"
                :key="prevention.id"
                :src="prevention.image"
              />
            </div>
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
    ...mapGetters(["getPrevention"])
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  max-width: 800px;
}
.image {
  text-align: center;
}
</style>
