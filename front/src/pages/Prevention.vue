<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
            <div class="col-12">
                <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive">
                    <template slot="header">
                        <h4 class="card-title">Prevention</h4>
                        <p class="card-category">코로나19 예방수칙</p>
                    </template>
                    <div class="image">
                        <img v-for="prevention in this.getPrevention" :key="prevention.id" :src="prevention.image">
                    </div>
                </card>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
    export default {
        computed:{
            ...mapGetters(['getPrevention'])
        }
    }
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    max-width: 800px;
}
.image{
    text-align: center;
}
</style>