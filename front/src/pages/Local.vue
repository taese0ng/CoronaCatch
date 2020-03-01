<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">지역별 코로나 현황</h4>
              <p class="card-category">전국 현재 상황</p>
            </template>
            <l-table class="table-hover table-striped"
                     :columns="table.columns"
                     :data="this.getLocalData">
            </l-table>
          </card>

        </div>
    </div>
   </div>
  </div>
</template>
<script>
  import LTable from 'src/components/Table.vue'
  import Card from 'src/components/Cards/Card.vue'
  import { mapGetters } from 'vuex'
  const tableColumns = ['id', '지역', '확진자', '격리해제', '사망자', '검사인원']
  
  export default {
    components: {
      Card,
      LTable
    },
    computed:{
      ...mapGetters(['getLocalData'])
    },
    data () {
      return {
        table: {
          columns: [...tableColumns],
        }
      }
    }
  }

</script>
<style>

</style>
