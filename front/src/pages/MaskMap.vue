<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">국내 마스크 현황 지도</h4>
            <p class="category">전국 약국 공공마스크 실시간 현황 # 5~10분 간격으로 차이가 있을 수 있음. #</p>
          </md-card-header>
          <md-card-content>
            <span id="myLocation" @click="myLocation"
              ><md-icon>my_location</md-icon>현재위치로 가기</span
            >
            <vue-daum-map
              :appKey="appKey"
              :center.sync="center"
              :level.sync="level"
              :mapTypeId="mapTypeId"
              :libraries="libraries"
              @load="onLoad"
              @dragend="createMarker"
              style="width:100%;height:500px;"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import VueDaumMap from "vue-daum-map";

var marker = [];
var mk, icon;
export default {
  components: {
    VueDaumMap
  },
  created() {
    if ("geolocation" in navigator) {
      console.log("사용가능!");
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.center.lat = pos.coords.latitude;
          this.UserlocPosition.lat = pos.coords.latitude;
          this.center.lng = pos.coords.longitude;
          this.UserlocPosition.lng = pos.coords.longitude;
        },
        err => {
          console.log(err.message);
        }
      );
    }
    var i = 1;
    this.$socket.emit("setLocation", this.center);
    this.$socket.on("setLocation", data => {
      this.mask = data.data.stores;
      // console.log("mask", this.mask);
      if (i == 1) {
        i = 0;
        this.drawMarker();
      }
    });
  },
  data() {
    return {
      UserlocPosition: { lat: 33.450701, lng: 126.570667 },
      mask: "",
      appKey: "key",
      center: { lat: 33.450701, lng: 126.570667 }, // 지도의 중심 좌표
      level: 3, // 지도의 레벨(확대, 축소 정도),
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
      libraries: [], // 추가로 불러올 라이브러리
      map: null // 지도 객체. 지도가 로드되면 할당됨.
    };
  },
  methods: {
    // 지도가 로드 완료되면 load 이벤트 발생
    onLoad(map) {
      this.map = map;
      this.map.setMinLevel(2);
      this.map.setMaxLevel(3);
      this.createMarker();
    },
    clearMarker() {
      marker.length = 0;
    },
    drawMarker() {
      var imageURL;
      for (var i = 0; i < this.mask.length; i++) {
        if (this.mask[i].remain_stat == "empty") {
          imageURL = require("../assets/img/mask0.png");
        } else if (this.mask[i].remain_stat == null) {
          imageURL = require("../assets/img/mask0.png");
        } else if (this.mask[i].remain_stat == "break") {
          imageURL = require("../assets/img/mask0.png");
        } else if (this.mask[i].remain_stat == "few") {
          imageURL = require("../assets/img/mask1.png");
        } else if (this.mask[i].remain_stat == "some") {
          imageURL = require("../assets/img/mask2.png");
        } else if (this.mask[i].remain_stat == "plenty") {
          imageURL = require("../assets/img/mask3.png");
        }
        icon = new kakao.maps.MarkerImage(
          imageURL,
          new kakao.maps.Size(31, 35),
          {
            offset: new kakao.maps.Point(16, 34),
            alt: "마커",
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
          }
        );
        mk = new kakao.maps.Marker({
          map: this.map,
          image: icon,
          position: new kakao.maps.LatLng(this.mask[i].lat, this.mask[i].lng)
        });
        marker.push(mk);
      }
    },
    createMarker() {
      this.$socket.emit("setLocation", this.center);
      this.clearMarker();
      this.drawMarker();
    },
    myLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            console.log(pos.coords);
            this.center.lat = pos.coords.latitude;
            this.center.lng = pos.coords.longitude;
          },
          err => {
            console.log(err.message);
          }
        );
      }
    }
  }
};
</script>

<style scoped>
#myLocation {
  position: absolute;
  font-weight: bold;
  margin: 20px;
  float: left;
  z-index: 100;
}
</style>
