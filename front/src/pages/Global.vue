<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">국가별 코로나 현황</h4>
            <p class="category">글로벌 코로나 확진자 순위</p>
          </md-card-header>
          <md-card-content>
            <md-table v-model="this.getForeignData" table-header-color="green">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="No.">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="국가">{{
                  item.country
                }}</md-table-cell>
                <md-table-cell md-label="확진자">{{
                  item.confirm
                }}</md-table-cell>
                <md-table-cell md-label="사망자">{{ item.die }}</md-table-cell>
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
    ...mapGetters(["getForeignData"])
  }
};
</script>
