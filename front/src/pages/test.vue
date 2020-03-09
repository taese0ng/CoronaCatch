<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <div class="d3"></div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
//https://m.blog.naver.com/PostView.nhn?blogId=jhc9639&logNo=221195987416&proxyReferer=https%3A%2F%2Fwww.google.co.jp%2F
import * as d3 from "d3";
import * as topojson from "topojson";
import { mapGetters } from "vuex";
const koreaMap = require("../assets/skorea-provinces-2018-topo-simple.json");
const mapInfo = [
  {
    name: "서울",
    lat: "37.532600",
    lon: "127.024612"
  },
  {
    name: "대전",
    lat: "36.3730178",
    lon: "127.2483736"
  },
  {
    name: "대구",
    lat: "35.823747",
    lon: "128.564322"
  },
  {
    name: "경북",
    lat: "36.457038",
    lon: "128.685900"
  },
  {
    name: "경기",
    lat: "37.563175",
    lon: "127.393231"
  },
  {
    name: "부산",
    lat: "35.158756",
    lon: "129.055312"
  },
  {
    name: "충남",
    lat: "36.604417",
    lon: "126.796437"
  },
  {
    name: "경남",
    lat: "35.417874",
    lon: "128.138220"
  },
  {
    name: "강원",
    lat: "37.830490",
    lon: "128.228396"
  },
  {
    name: "울산",
    lat: "35.545597",
    lon: "129.257273"
  },
  {
    name: "충북",
    lat: "36.790215",
    lon: "127.683863"
  },
  {
    name: "광주",
    lat: "35.155227",
    lon: "126.830114"
  },
  {
    name: "인천",
    lat: "37.451153",
    lon: "126.673609"
  },
  {
    name: "전북",
    lat: "35.724055",
    lon: "127.116647"
  },
  {
    name: "전남",
    lat: "34.861789",
    lon: "126.942822"
  },
  {
    name: "제주",
    lat: "33.462169",
    lon: "126.525105"
  },
  {
    name: "세종",
    lat: "36.486367",
    lon: "127.276387"
  }
];
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const koreaMap = require("../assets/skorea-provinces-2018-topo-simple.json");
      const geojson = topojson.feature(
        koreaMap,
        koreaMap.objects.skorea_provinces_2018_geo
      );
      const center = d3.geoCentroid(geojson);
      const width = this.$store.state.mapWidth + 200;
      const height = width;
      const svg = d3
        .select(".d3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const projection = d3
        .geoMercator()
        .scale(1)
        .translate([0, 0]);
      const path = d3.geoPath().projection(projection);
      const bounds = path.bounds(geojson);
      const widthScale = (bounds[1][0] - bounds[0][0]) / width;
      const heightScale = (bounds[1][1] - bounds[0][1]) / height;
      const scale = 1 / Math.max(widthScale, heightScale);
      const xoffset =
        width / 2 -
        (scale * (bounds[1][0] + bounds[0][0])) / 2 +
        this.$store.state.isMobile;
      const yoffset = height / 2 - (scale * (bounds[1][1] + bounds[0][1])) / 2;
      const offset = [xoffset, yoffset];
      projection.scale(scale).translate(offset);
      const map = svg
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path);
      const icons = svg
        .append("g")
        .selectAll("svg")
        .data(mapInfo)
        .enter()
        .append("svg:image")
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", d => projection([d.lon, d.lat])[0])
        .attr("y", d => projection([d.lon, d.lat])[1])
        .attr("opacity", 1)
        .attr("xlink:href", require("../assets/cycle.svg"));

      const zoomed = () => {
        map.attr("transform", d3.event.transform);
        icons.attr("transform", d3.event.transform);
      };
      const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);
      //svg.call(zoom);
    }
  }
};
</script>
<style>
.d3 {
  background: white;
  width: 100%;
  margin: 0 auto;
}
path {
  fill: rgb(214, 236, 220);
  stroke: rgb(240, 136, 115);
}
</style>
