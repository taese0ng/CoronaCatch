<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">지역별 코로나 현황</h4>
            <p class="category">지역별 코로나 확진자 추이</p>
            <p class="category">{{ this.getLocalData.time }} 기준</p>
          </md-card-header>
          <md-card-content>
            <md-table
              v-model="this.getLocalData.data"
              table-header-color="green"
            >
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="No.">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="지역">{{ item.area }}</md-table-cell>
                <md-table-cell md-label="확진자">{{
                  item.confirm
                }}</md-table-cell>
                <md-table-cell md-label="사망자">{{ item.die }}</md-table-cell>
                <md-table-cell md-label="격리해제수">{{
                  item.check
                }}</md-table-cell>
                <md-table-cell md-label="전일대비확진환자증감">{{
                  item.increase
                }}</md-table-cell>
              </md-table-row>
            </md-table>
            <!-- <simple-table table-header-color="green"></simple-table> -->
          </md-card-content>
        </md-card>
      </div>

      <!-- <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Table on Plain Background</h4>
            <p class="category">Here is a subtitle for this table</p>
          </md-card-header>
          <md-card-content>
            <ordered-table></ordered-table>
          </md-card-content>
        </md-card>
      </div> -->
    </div>
  </div>
</template>

<script>
// import { SimpleTable, OrderedTable } from "@/components";
import { mapGetters } from "vuex";

export default {
  components: {
    // OrderedTable,
    // SimpleTable
  },
  computed: {
    ...mapGetters(["getLocalData"])
  }
};
</script>
