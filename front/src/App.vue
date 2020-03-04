<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  created(){
    this.$socket.on("coronaData",data=>{
      console.log(data)
      this.setCoronaDay(data.accumulateData)
      this.setData(data.coronaData)
      this.setForeignData(data.foreignData)
    }),
    
    this.$socket.on("areaData",data=>{
      this.setLocalData(data.data)
      console.log(data)
    })
  },
  methods:{
    ...mapMutations(['setData','setCoronaDay', 'setForeignData', 'setLocalData']),
  }
}
</script>

<style lang="scss">
  .vue-notifyjs.notifications{
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }
  .main-panel{
    overflow: auto;
  }
</style>
