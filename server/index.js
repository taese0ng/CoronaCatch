const axios = require("axios");
const cheeiro = require("cheerio");
const log = console.log;
const express = require("express");
var history = require('connect-history-api-fallback'); //npm install --save connect-history-api-fallback
const app = express();
const server = app.use(history()).listen(3000, function() {
  console.log("Listening on port *: 3000");
});
const schedule = require("node-schedule");

var coronaData = [];
var foreignData = [];
var areaData = [];

var accumulateData = [
  { date: "2/18", confirm: 31, unlock: 12, die: 0 },
  { date: "2/19", confirm: 51, unlock: 16, die: 0 },
  { date: "2/20", confirm: 104, unlock: 16, die: 1 },
  { date: "2/21", confirm: 204, unlock: 17, die: 1 },
  { date: "2/22", confirm: 433, unlock: 18, die: 2 },
  { date: "2/23", confirm: 602, unlock: 18, die: 5 },
  { date: "2/24", confirm: 833, unlock: 22, die: 7 },
  { date: "2/25", confirm: 977, unlock: 22, die: 10 },
  { date: "2/26", confirm: 1261, unlock: 24, die: 12 },
  { date: "2/27", confirm: 1766, unlock: 26, die: 13 },
  { date: "2/28", confirm: 2337, unlock: 27, die: 13 },
  { date: "2/29", confirm: 3150, unlock: 28, die: 17 }
];

const io = require("socket.io")(server);

app.use(express.static("dist"));

const getHtml = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};

const getHtmlDomestic = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=13&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};
//중복제외 검사

const overlapCheck = function(dateKey) {
  if (accumulateData[accumulateData.length - 1]["date"] != dateKey) return true;
  return false;
};

getHtmlDomestic()
  .then(html => {
    let list = [];
    const $ = cheeiro.load(html.data);
    const $bodyList = $("div.data_table table.num tbody").children("tr");
    $bodyList.each(function(i, elem) {
      let area = $(this)
        .children("th")
        .text();
      let confirm_str = $(this)
        .children("td")
        .eq(1)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");
      let unlock_str = $(this)
        .children("td")
        .eq(3)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");
      let die_str = $(this)
        .children("td")
        .eq(4)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");
      let check_str = $(this)
        .children("td")
        .eq(6)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");

      let confirm = parseInt(confirm_str);
      let unlock = parseInt(unlock_str);
      let die = parseInt(die_str);
      let check = parseInt(check_str);

      if (area != "검역")
        list[i] = {
          area: area,
          confirm: confirm,
          unlock: unlock,
          die: die,
          check: check
        };
    });
    const data = list;
    return data;
  })
  .then(res => {
    areaData = res;
    log(res);
  });

//서버 실행 시 데이터 크롤링
getHtml()
  .then(html => {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let dateKey = "" + month + "/" + day;
    let ulList = [];
    let countryList = [];
    const $ = cheeiro.load(html.data);
    const $bodyList = $("div.data_table table.num tbody").children("tr");

    // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
    $bodyList.each(function(i, elem) {
      let title = $(this)
        .children("th")
        .text();
      let country = $(this)
        .children("td.w_bold")
        .text();
      let data_str = $(this)
        .children("td")
        .text();
      data_str = data_str.replace(/,/gi, "").replace(/명/gi, "");

      //국내 데이터
      if (i in [0, 1, 2, 3]) {
        let data = parseInt(data_str);

        //0번 이면서 데이터가 있지 않으면

        if (i == 0) {
          if (overlapCheck(dateKey))
            accumulateData[accumulateData.length] = {
              date: dateKey,
              confirm: data
            };
          else accumulateData[accumulateData.length - 1]["confirm"] = data;
        } else if (i == 1)
          accumulateData[accumulateData.length - 1]["unlock"] = data;
        else if (i == 2)
          accumulateData[accumulateData.length - 1]["die"] = data;

        ulList[i] = {
          title: title,
          data: data
        };
      }

      //국외 데이터
      else {
        // log("나라: "+country)
        // log("데이터 총합: "+data_str)
        let temp = data_str
          .replace(country, "")
          .replace(/\(/gi, "")
          .replace(/\)/gi, "");
        // log("자름: "+temp)

        if (temp.indexOf("사망 ")) {
          let confirm = temp.slice(0, temp.indexOf("사"));
          let die = temp.slice(temp.indexOf("망") + 2, temp.length);

          // log("111: "+confirm)
          // log("222: "+die)

          countryList[i - 4] = {
            country: country,
            confirm: confirm,
            die: die
          };
        } else
          countryList[i - 4] = {
            country: country,
            confirm: temp,
            die: 0
          };
      }
    });
    // console.log(ulList)
    const data = {
      domestic: ulList,
      foreign: countryList
    };
    return data;
  })
  .then(res => {
    // log(accumulateData)
    coronaData = res.domestic;
    foreignData = res.foreign;
    // log(coronaData);
  });

// 매시간(테스트용 1분마다)마다 데이터 크롤링 후 프론트로 전송
const j = schedule.scheduleJob("1 1 * * * *", function() {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let dateKey = "" + month + "/" + day;

  //없는 key (새로 들어오는 데이터면 초기화)

  getHtmlDomestic()
    .then(html => {
      let list = [];
      const $ = cheeiro.load(html.data);
      const $bodyList = $("div.data_table table.num tbody").children("tr");
      $bodyList.each(function(i, elem) {
        let area = $(this)
          .children("th")
          .text();
        let confirm_str = $(this)
          .children("td")
          .eq(1)
          .text()
          .replace(/\t/gi, "")
          .replace(/,/gi, "");
        let unlock_str = $(this)
          .children("td")
          .eq(3)
          .text()
          .replace(/\t/gi, "")
          .replace(/,/gi, "");
        let die_str = $(this)
          .children("td")
          .eq(4)
          .text()
          .replace(/\t/gi, "")
          .replace(/,/gi, "");
        let check_str = $(this)
          .children("td")
          .eq(6)
          .text()
          .replace(/\t/gi, "")
          .replace(/,/gi, "");

        let confirm = parseInt(confirm_str);
        let unlock = parseInt(unlock_str);
        let die = parseInt(die_str);
        let check = parseInt(check_str);

        if (area != "검역")
          list[i] = {
            area: area,
            confirm: confirm,
            unlock: unlock,
            die: die,
            check: check
          };
      });
      const data = list;
      return data;
    })
    .then(res => {
      areaData = res;
      io.emit("areaData", areaData);
      log(res);
    });

  getHtml()
    .then(html => {
      let ulList = [];
      let countryList = [];
      const $ = cheeiro.load(html.data);
      const $bodyList = $("div.data_table table.num tbody").children("tr");

      // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
      $bodyList.each(function(i, elem) {
        let title = $(this)
          .children("th")
          .text();
        let country = $(this)
          .children("td.w_bold")
          .text();
        let data_str = $(this)
          .children("td")
          .text();
        data_str = data_str.replace(/,/gi, "").replace(/명/gi, "");

        //국내 데이터
        if (i in [0, 1, 2, 3]) {
          let data = parseInt(data_str);

          if (i == 0) {
            if (overlapCheck(dateKey))
              accumulateData[accumulateData.length] = {
                date: dateKey,
                confirm: data
              };
            else accumulateData[accumulateData.length - 1]["confirm"] = data;
          } else if (i == 1)
            accumulateData[accumulateData.length - 1]["unlock"] = data;
          else if (i == 2)
            accumulateData[accumulateData.length - 1]["die"] = data;

          ulList[i] = {
            title: title,
            data: data
          };
        }

        //국외 데이터
        else {
          let temp = data_str
            .replace(country, "")
            .replace(/\(/gi, "")
            .replace(/\)/gi, "");

          if (temp.indexOf("사망 ") != -1) {
            let confirm = temp.slice(0, temp.indexOf("사"));
            let die = temp.slice(temp.indexOf("망") + 2, temp.length);

            countryList[i - 4] = {
              country: country,
              confirm: confirm,
              die: die
            };
          } else
            countryList[i - 4] = {
              country: country,
              confirm: temp,
              die: 0
            };
        }
      });
      // console.log(ulList)
      const data = {
        domestic: ulList,
        foreign: countryList
      };
      return data;
    })
    .then(res => {
      coronaData = res.domestic;
      foreignData = res.foreign;

      // log(coronaData);
      let data = {
        accumulateData: accumulateData,
        coronaData: res.domestic,
        foreignData: res.foreign
      };
      // log(accumulateData)
      io.emit("coronaData", data);
    });
});

io.on("connection", socket => {
  console.log(socket.client.id); // Prints client socket id
  //console.log(socket.id);

  let data = {
    accumulateData: accumulateData,
    coronaData: coronaData,
    foreignData: foreignData
  };

  io.emit("coronaData", data);
  io.emit("areaData", areaData);
});
