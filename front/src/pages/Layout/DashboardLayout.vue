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
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
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
