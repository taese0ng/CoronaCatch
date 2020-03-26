<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>hotel</md-icon>
          </template>

          <template slot="content">
            <p class="title">확진자</p>
            <h3 class="title">
              <animated-number
                :value="this.getData[0].data"
                :formatValue="formatToPrice"
                :duration="500"
              />
              <small> 명</small>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ this.getDate }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="red">
          <template slot="header">
            <md-icon>blur_off</md-icon>
          </template>

          <template slot="content">
            <p class="title">사망자</p>
            <h3 class="title">
              <animated-number
                :value="this.getData[3].data"
                :formatValue="formatToPrice"
                :duration="500"
              />
              <small> 명</small>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ this.getDate }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>favorite_border</md-icon>
          </template>

          <template slot="content">
            <p class="title">확진환자 격리해제</p>
            <h3 class="title">
              <animated-number
                :value="this.getData[1].data"
                :formatValue="formatToPrice"
                :duration="500"
              />
              <small> 명</small>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ this.getDate }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>search</md-icon>
          </template>

          <template slot="content">
            <p class="title">검사진행</p>
            <h3 class="title">
              <animated-number
                :value="this.getData[2].data"
                :formatValue="formatToPrice"
                :duration="500"
              />
              <small> 명</small>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ this.getDate }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="this.getlocalCoronaChartData.data"
          :chart-options="this.getlocalCoronaChartData.options"
          :chart-type="'Line'"
          data-background-color="blue"
        >
          <template slot="content">
            <h4 class="title">국내 코로나 그래프</h4>
            <p class="title">
              국내 코로나 확진자 비교
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <i class="fa fa-circle text-white"></i> 확진자
            </div>
            <div class="stats">
              <md-icon>access_time</md-icon>
              Updated 1 day ago
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="this.getlocalCoronaChartData.data2"
          :chart-options="this.getlocalCoronaChartData.options2"
          :chart-type="'Line'"
          data-background-color="green"
        >
          <template slot="content">
            <h4 class="title">국내 코로나 그래프</h4>
            <p class="title">
              국내 코로나 사망자, 격리해제 비교
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <i class="fa fa-circle text-white"></i> 격리해제
              <i class="fa fa-circle text-danger"></i> 사망자
            </div>
            <div class="stats">
              <md-icon>access_time</md-icon>
              Updated 1 day ago
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="this.getforeignCoronaChartData.data"
          :chart-options="emailsSubscriptionChart.options"
          :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
          :chart-type="'Bar'"
          data-background-color="red"
        >
          <template slot="content">
            <h4 class="title">글로벌 코로나 그래프</h4>
            <p class="title">
              코로나 피해 주요 국가별 확진자 추이
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <i class="fa fa-circle text-white"></i> 확진자
            </div>
            <div class="stats">
              <md-icon>access_time</md-icon>
              Updated 1 day ago
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="this.getforeignCoronaChartData.data2"
          :chart-options="emailsSubscriptionChart.options"
          :chart-responsive-options="emailsSubscriptionChart.responsiveOptions"
          :chart-type="'Bar'"
          data-background-color="orange"
        >
          <template slot="content">
            <h4 class="title">글로벌 코로나 그래프</h4>
            <p class="title">
              코로나 피해 주요 국가별 사망자 추이
            </p>
          </template>

          <template slot="footer">
            <div class="stats">
              <i class="fa fa-circle text-white"></i> 사망자
            </div>
            <div class="stats">
              <md-icon>access_time</md-icon>
              Updated 1 day ago
            </div>
          </template>
        </chart-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard, ChartCard } from "@/components";
import { mapGetters } from "vuex";
import AnimatedNumber from "animated-number-vue";
//https://www.npmjs.com/package/animated-number-vue

export default {
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber
  },
  computed: {
    ...mapGetters([
      "getData",
      "getDate",
      "getlocalCoronaChartData",
      "getforeignCoronaChartData"
    ])
  },
  data() {
    return {
      emailsSubscriptionChart: {
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          chartPadding: {
            top: 20,
            right: 5,
            bottom: -10,
            left: 20
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      }
    };
  },
  methods: {
    formatToPrice(value) {
      return `${value.toFixed(0)}`;
    }
  }
};
</script>
