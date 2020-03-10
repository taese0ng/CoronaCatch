<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <!-- <notifications></notifications> -->

    <side-bar>
      <sidebar-link to="/home">
        <md-icon>dashboard</md-icon>
        <p>Home</p>
      </sidebar-link>
      <sidebar-link to="/global">
        <md-icon>language</md-icon>
        <p>Global</p>
      </sidebar-link>
      <sidebar-link to="/local">
        <md-icon>my_location</md-icon>
        <p>Local</p>
      </sidebar-link>
      <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/preventation">
        <md-icon>notification_important</md-icon>
        <p>Preventation</p>
      </sidebar-link>
      <sidebar-link to="/about">
        <md-icon>star</md-icon>
        <p>About</p>
      </sidebar-link>
      <div id="ad">
        <iframe
          width="200"
          height="200"
          allowtransparency="true"
          src="http://tab2.clickmon.co.kr/pop/wp_ad_200.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1070545%7C%5E%7CAdver_M_1046207&mon_rf=http://coronacatch.com"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>
      <div style=" width: 800px; height: 100px">
        <iframe
          width="728"
          height="90"
          allowtransparency="true"
          src="https://tab2.clickmon.co.kr/pop/wp_ad_728.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1070545%7C%5E%7CAdver_M_1046207&mon_rf=http://coronacatch.com"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
#ad {
  position: absolute;
  bottom: 0px;
}
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter
  }
};
</script>
