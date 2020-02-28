<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-ambulance text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">확진자</p>
              <h4 class="card-title">{{this.getData[0].data}} 명</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>{{this.getDate}}
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-fav-remove text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">사망자</p>
              <h4 class="card-title">{{this.getData[2].data}} 명</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>{{this.getDate}}
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="nc-icon nc-favourite-28 text-info"></i>
            </div>
            <div slot="content">
              <p class="card-category">확진환자 격리해제</p>
              <h4 class="card-title">{{this.getData[1].data}} 명</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>{{this.getDate}}
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-zoom-split text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">검사진행</p>
              <h4 class="card-title">{{this.getData[3].data}} 명</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>{{this.getDate}}
            </div>
          </stats-card>
        </div>

      </div>
      <div class="row">
        <div class="col-md-12">
          <chart-card :chart-data="this.getlineChartData.data"
                      :chart-options="this.getlineChartData.options"
                      :responsive-options="this.getlineChartData.responsiveOptions">
            <template slot="header">
              <h4 class="card-title">코로나 그래프</h4>
              <p class="card-category">매일 코로나 환자 비교</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 격리해제
                <i class="fa fa-circle text-danger"></i> 사망자
                <i class="fa fa-circle text-warning"></i> 확진자
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <chart-card
            :chart-data="barChart.data"
            :chart-options="barChart.options"
            :chart-responsive-options="barChart.responsiveOptions"
            chart-type="Bar">
            <template slot="header">
              <h4 class="card-title">코로나 글로벌 그래프</h4>
              <p class="card-category">각 국가의 코로나피해 비교</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 확진자
                <i class="fa fa-circle text-danger"></i> 사망자
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-check"></i> Data information certified
              </div>
            </template>
          </chart-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/Cards/ChartCard.vue'
  import StatsCard from 'src/components/Cards/StatsCard.vue'
  import LTable from 'src/components/Table.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: {
      LTable,
      ChartCard,
      StatsCard
    },
    computed: {
      ...mapGetters(['getData', 'getDate','getlineChartData'])
    },
    data () {
      return {
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',
        barChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
              [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
      }
    }
  }
</script>
<style>
</style>
