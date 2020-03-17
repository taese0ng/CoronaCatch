const express = require('express'); 
const https = require('https');
const http = require('http');
const fs = require('fs');
const axios = require("axios");
const cheeiro = require("cheerio");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csvtojson');
const schedule = require("node-schedule");
var history = require("connect-history-api-fallback"); //npm install --save connect-history-api-fallback
const app = express();

const options = { // letsencrypt로 받은 인증서 경로를 입력해 줍니다.
ca: fs.readFileSync('/etc/letsencrypt/live/www.coronacatch.com/fullchain.pem'),
key: fs.readFileSync('/etc/letsencrypt/live/www.coronacatch.com/privkey.pem'),
cert: fs.readFileSync('/etc/letsencrypt/live/www.coronacatch.com/cert.pem')
};

app.use(history());
app.use(express.static("dist"));

// app.use(function(req,res,next){
//   if(!req.secure)
//     res.redirect("https://"+req.headers.host+req.url);
//   else
//     next();
// })

http.createServer(function(req,res){
  res.writeHead(301,{"Location":"https://"+req.headers['host']+req.url});
  res.end();
}).listen(80,function(){
    console.log("80포트 염");
});

const server = https.createServer(options, app).listen(443,"0.0.0.0",function(){
    console.log("443포트 염");
});

const io = require("socket.io")(server);

var localImage;
var coronaData = [];
var foreignData = [];
var areaData = [];
var accumulateData = [];

//기존 파일 읽어서 서버의 배열에 저장
csv()
  .fromFile("accumulateData.csv")
  .then(json => {
    accumulateData = json;
  });

//csv파일에 저장하기 위한 writer선언
const csvWriter = createCsvWriter({
  path: "accumulateData.csv",
  header: [
    { id: "date", title: "date" },
    { id: "confirm", title: "confirm" },
    { id: "unlock", title: "unlock" },
    { id: "die", title: "die" }
  ],
  append: true,
  recordDelimiter: "\r\n"
});

//csv파일에 덮어쓰기 위한 writer선언
const csvUpdateWriter = createCsvWriter({
  path: "accumulateData.csv",
  header: [
    { id: "date", title: "date" },
    { id: "confirm", title: "confirm" },
    { id: "unlock", title: "unlock" },
    { id: "die", title: "die" }
  ],
  recordDelimiter: "\r\n"
});

// 국가별 데이터 가져옴
const getHtmlForeign = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=14&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};

// 국내 총 데이터 가져옴
const getHtmlDomestic = async () => {
  try {
    return await axios.get(
      "https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%98+%ED%99%95%EC%A7%84%EC%9E%90"
    );
  } catch (err) {
    console.error(err);
  }
};

// 지역별 데이터 가져옴
const getHtmlLocal = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=13&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};

// 이미지가 있는 링크
const getHtmlImage = async () => {
  try {
    return await axios.get(
      "https://terms.naver.com/entry.nhn?docId=5912275&cid=43667&categoryId=43667"
    );
  } catch (err) {
    console.error(err);
  }
};

//json 요청
const getJson = async url => {
  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err);
  }
};

// 1시간마다 갱신하기 때문에 중복제외 검사
const overlapCheck = function(dateKey) {
  if (accumulateData[accumulateData.length - 1]["date"] != dateKey) return true;
  return false;
};

// 네이버 이미지 가져오는 방법 정의
const getImageSrc = function(html) {
  let src;
  const $ = cheeiro.load(html.data);
  const $bodyImg = $(
    "div.se_image div.se_sectionArea div.se_editArea div.se_viewArea"
  )
    .eq(5)
    .children("a.se_mediaArea");

  src = $bodyImg.find(".se_mediaImage").attr("data-src");

  return src;
};

// 지역별 데이터 가져오는 방법 정의
const getLocalData = function(html) {
  let list = {};
  const $ = cheeiro.load(html.data);
  const $bodyList = $("div.data_table table.num tbody").children("tr");
  const time = $("div.timetable p.info")
    .children("span")
    .text();
  list["time"] = time;
  list["data"] = [];
  $bodyList.each(function(i, elem) {
    let area = $(this)
      .children("th")
      .text();

    let increase_str = $(this)
      .children("td")
      .eq(0)
      .text()
      .replace(/\t/gi, "")
      .replace(/,/gi, "");

    let confirm_str = $(this)
      .children("td")
      .eq(1)
      .text()
      .replace(/\t/gi, "")
      .replace(/,/gi, "");

    let die_str = $(this)
      .children("td")
      .eq(3)
      .text()
      .replace(/\t/gi, "")
      .replace(/,/gi, "");

    let check_str = $(this)
      .children("td")
      .eq(2)
      .text()
      .replace(/\t/gi, "")
      .replace(/,/gi, "");

    let increase = parseInt(increase_str);
    let confirm = parseInt(confirm_str);
    let check = parseInt(check_str);
    let die = parseInt(die_str);

    if (area != "검역")
      list["data"][i] = {
        area: area,
        increase: increase,
        confirm: confirm,
        die: die,
        check: check
      };
  });
  const data = list;
  return data;
};

//국내 데이터 가져오는 방법 정의
const getDomesticData = function(html) {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let overlap = false;
  let dateKey = "" + month + "/" + day;
  let ulList = [];
  let updateCheck = false;
  const $ = cheeiro.load(html.data);
  const $bodyList = $("div.graph_view div.box div.circle").children("p.txt");

  $bodyList.each(function(i, elem) {
    let title = $(this)
      .children("span.txt_sort")
      .text();
    let data_str = $(this)
      .children("strong.num")
      .text()
      .replace(/,/, "")
      .replace(/"/, "");
    let data = parseInt(data_str);
    if (i == 0) {
      if (overlapCheck(dateKey)) {
        updateCheck = false;
        overlap = false;
        accumulateData[accumulateData.length] = {
          date: dateKey,
          confirm: data_str
        };
      } else {
        overlap = true;
        if (accumulateData[accumulateData.length - 1]["confirm"] != data_str)
          updateCheck = true;
        accumulateData[accumulateData.length - 1]["confirm"] = data_str;
      }
    } else if (i == 1)
      accumulateData[accumulateData.length - 1]["unlock"] = data_str;
    else if (i == 3)
      accumulateData[accumulateData.length - 1]["die"] = data_str;

    ulList[i] = {
      title: title,
      data: data
    };
  });

  // 저장 중복 검사
  if (!overlap) {
    const addDate = [];
    addDate.push(accumulateData[accumulateData.length - 1]);
    csvWriter.writeRecords(addDate).then(() => {
      log("CSV 파일에 추가 성공!");
    });
  }
  if (updateCheck) {
    csvUpdateWriter.writeRecords(accumulateData).then(() => {
      log("CSV 파일 다시 저장 성공!");
    });
  }

  updateCheck = false;
  overlap = false;

  const data = {
    domestic: ulList
  };
  return data;
};

//국가별 데이터 가져오는 방법 정의, 누적 데이터도 여기서
const getGlobalData = function(html) {
  let countryList = [];
  const $ = cheeiro.load(html.data);
  const $bodyList = $("div.data_table table.num tbody")
    .eq(0)
    .children("tr");
  // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행

  $bodyList.each(function(i, elem) {
    if (i > -1) {
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

      //국외 데이터

      let temp = data_str
        .replace(country, "")
        .replace(/\(/gi, "")
        .replace(/\)/gi, "");

      if (temp.indexOf("사망 ") != -1) {
        let confirm = temp.slice(0, temp.indexOf("사"));
        let die = temp.slice(temp.indexOf("망") + 2, temp.length);

        confirm = parseInt(confirm);

        die = parseInt(die);

        countryList[i] = {
          country: country,
          confirm: confirm,
          die: die
        };
      } else {
        temp = parseInt(temp);
        countryList[i] = {
          country: country,
          confirm: temp,
          die: 0
        };
      }
    }
  });

  const data = {
    foreign: countryList
  };
  return data;
};

// // 마스크 api 처음에 가져올때
// let storeTotalCheck = 0;
// let saleTotalCheck = 0;
// let totalStores = 0;
// var storeInfos = [];
// var sales = [];
// var storeSales = [];

// for (let i = 1; i <= 6; i++) {
//   getJson("https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/stores/json?perPage=5000&page=" + i)
//     .then(html => {
//       let data = html.data;
//       storeInfos = storeInfos.concat(data.storeInfos);
//       totalStores = data.totalCount;
//       storeTotalCheck++;

//     })
//     .then(() => {
//       if (storeTotalCheck == 6) {
//         storeTotalCheck = 0;
//         console.log(storeInfos.length);
//         for (let i = 1; i <= 6; i++) {
//           getJson("https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?perPage=5000&page=" + i)
//             .then(html => {

//               let data = html.data;

//               let totalCount = data.totalCount;
//               sales = sales.concat(data.sales);
//               saleTotalCheck++;
//               return totalCount;
//             })
//             .then((totalCount) => {
//               if (saleTotalCheck == 6) {
//                 // console.log(storeInfos[0].code);

//                 for (let j = 0; j < totalCount; j++) {

//                   // sales배열과 storeInfos배열이 같은코드가 있는 것 찾기

//                   let temp = storeInfos.filter(function (item) {

//                     return item.code == sales[j].code;
//                   })

//                   if (temp.length == 0)
//                     continue;
//                   storeSales[j] = {
//                     code: temp[0].code,
//                     addr: temp[0].addr,
//                     lat: temp[0].lat,
//                     lng: temp[0].lng,
//                     name: temp[0].name,
//                     type: temp[0].type,
//                     created_at: sales[j].created_at,
//                     remain_stat: sales[j].remain_stat,
//                     stock_at: sales[j].stock_at
//                   }

//                 }
//                 console.log("storeSales");
//                 console.log(storeSales.length);
//                 return storeSales;
//               }
//             })
//             .then((storeSales) => {
//               if (saleTotalCheck == 6) {
//                 saleTotalCheck = 0;
//                 console.log(storeSales[0]);
//                 io.emit("storeSales", storeSales);
//               }
//             })
//         }
//       }
//     })
// }

// // 마스크 api 5분마다 한번씩 가져오기
// schedule.scheduleJob("50 */5 * * * *", function () {
//   console.log("지금 들어옴")
//   let saleTotalCheck = 0;
//   for (let i = 1; i <= 6; i++) {
//     getJson("https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?perPage=5000&page=" + i)
//       .then(html => {

//         let data = html.data;

//         let totalCount = data.totalCount;
//         sales = sales.concat(data.sales);
//         saleTotalCheck++;
//         return totalCount;
//       })
//       .then((totalCount) => {
//         if (saleTotalCheck == 6) {
//           // console.log(storeInfos[0].code);

//           for (let j = 0; j < totalCount; j++) {
//             // console.log(j);
//             // sales배열과 storeInfos배열이 같은코드가 있는 것 찾기
//             let temp = storeInfos.filter(function (item) {
//               return item.code == sales[j].code;
//             })

//             if (temp.length == 0)
//               continue;

//             storeSales[j] = {
//               code: temp[0].code,
//               addr: temp[0].addr,
//               lat: temp[0].lat,
//               lng: temp[0].lng,
//               name: temp[0].name,
//               type: temp[0].type,
//               created_at: sales[j].created_at,
//               remain_stat: sales[j].remain_stat,
//               stock_at: sales[j].stock_at
//             }

//           }
//           console.log("storeSales");
//           console.log(storeSales.length);
//         }
//       })
//       .then((storeSales) => {
//         if (saleTotalCheck == 6) {
//           saleTotalCheck = 0;
//           io.emit("storeSales", storeSales);
//         }
//       })
//   }
// });

//서버 시작시 한번 동작

getHtmlImage()
  .then(html => {
    let src = getImageSrc(html);
    // log(html);
    return src;
  })
  .then(res => {
    localImage = res;
    // log(res);
  });

getHtmlLocal()
  .then(html => {
    let res = getLocalData(html);

    return res;
  })
  .then(res => {
    areaData = res;
    // log("국내별");
    // log(areaData);
  });

getHtmlForeign()
  .then(html => {
    let res = getGlobalData(html);
    return res;
  })
  .then(res => {
    foreignData = res.foreign;
    // log("국외");
    // log(res);

    return res;
  });

getHtmlDomestic()
  .then(html => {
    let res = getDomesticData(html);
    return res;
  })
  .then(res => {
    coronaData = res.domestic;
    // log("국내");
    // log(res);
    // log("누적");
    // log(accumulateData);
  });

// 매시간(테스트용 1분마다)마다 데이터 크롤링 후 프론트로 전송
const j = schedule.scheduleJob("1 1 * * * *", function() {
  getHtmlImage()
    .then(html => {
      let src = getImageSrc(html);
      // log(html);
      return src;
    })
    .then(res => {
      localImage = res;
      io.emit("localImage", localImage);
    });

  getHtmlLocal()
    .then(html => {
      let res = getLocalData(html);
      return res;
    })
    .then(res => {
      areaData = res;
      io.emit("localData", areaData);
      // log("1시간 후 국내별");
      // log(res);
    });

  getHtmlForeign()
    .then(html => {
      let res = getGlobalData(html);
      return res;
    })
    .then(res => {
      foreignData = res.foreign;
      let data = foreignData;
      io.emit("foreignData", data);
      return res;
    });

  getHtmlDomestic()
    .then(html => {
      let res = getDomesticData(html);
      return res;
    })
    .then(res => {
      coronaData = res.domestic;
      let data = {
        accumulateData: accumulateData,
        coronaData: res.domestic
      };
      // log("1시간 후 국내");
      // log(res);
      // log("1시간 후 누적");
      // log(accumulateData);
      io.emit("coronaData", data);
    });
});

io.on("connection", socket => {
  console.log(socket.client.id); // Prints client socket id
  //console.log(socket.id);

  let data = {
    accumulateData: accumulateData,
    coronaData: coronaData
  };

  io.to(socket.client.id).emit("coronaData", data);
  io.to(socket.client.id).emit("localData", areaData);
  io.to(socket.client.id).emit("foreignData", foreignData);
  io.to(socket.client.id).emit("localImage", localImage);

  socket.on("setLocation", center => {
    let lat = center.lat; //위도
    let lng = center.lng; //경도
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var msg;
    // lat=37.491130
    // lng=127.988821
    if (lat < 33.0 || lat > 43.0 || lng < 124.0 || lng > 132.0) msg = "NO";
    else {
      msg = "YES";
      getJson(
        "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?m=3000&lat=" +
          lat +
          "&lng=" +
          lng
      ).then(html => {
        let data = html.data;
        let emitData = {
          msg: msg,
          data: data
        };
        io.to(socket.client.id).emit("setLocation", emitData);
      });
    }
  });
});

