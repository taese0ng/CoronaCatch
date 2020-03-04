const axios = require("axios");
const cheeiro = require("cheerio");
const log = console.log;
const express = require("express");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csvtojson');
var history = require('connect-history-api-fallback'); //npm install --save connect-history-api-fallback
const app = express();
const server = app.use(history()).listen(3000, function() {
  console.log("Listening on port *: 3000");
});
const schedule = require("node-schedule");

var coronaData = [];
var foreignData = [];
var areaData = [];
var accumulateData = [];

//기존 파일 읽어서 서버의 배열에 저장
csv().fromFile('accumulateData.csv')
  .then((json)=>{
  accumulateData  = json;
  
});

//csv파일에 저장하기 위한 writer선언
const csvWriter = createCsvWriter({
  path:'accumulateData.csv',
  header:[
    {id:"date", title:"date"},
    {id:"confirm", title:"confirm"},
    {id:"unlock", title:"unlock"},
    {id:"die", title:"die"}
  ],
  append:true,
  recordDelimiter:'\r\n'
});


const io = require("socket.io")(server);

app.use(express.static("dist"));

// 국가별, 국내총 데이터 가져옴
const getHtml = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};

// 지역별 데이터 가져옴
const getHtmlDomestic = async () => {
  try {
    return await axios.get(
      "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=13&ncvContSeq=&contSeq=&board_id=&gubun="
    );
  } catch (err) {
    console.error(err);
  }
};

// 1시간마다 갱신하기 때문에 중복제외 검사
const overlapCheck = function(dateKey) {
  if (accumulateData[accumulateData.length - 1]["date"] != dateKey) return true;
  return false;
};

// 지역별 데이터 가져오는 방법 정의
const getLocalData = function(html){
  let list = {};
    const $ = cheeiro.load(html.data);
    const $bodyList = $("div.data_table table.num tbody").children("tr");
    const time = $("div.timetable p.info").children("span").text();
    list['time'] = time;
    list['data'] = [];
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
        .eq(2)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");
      
      let check_str = $(this)
        .children("td")
        .eq(4)
        .text()
        .replace(/\t/gi, "")
        .replace(/,/gi, "");
     
      let increase = parseInt(increase_str);
      let confirm = parseInt(confirm_str);
      let check = parseInt(check_str);
      let die = parseInt(die_str);

      if (area != "검역")
        list['data'][i] = {
          area: area,
          increase:increase,
          confirm: confirm,
          die: die,
          check: check,
        };
    });
    const data = list;
    return data;
}

//국내 국가별 데이터 가져오는 방법 정의
const getGlobalData = function(html){
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let overlap = false;
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
      data_str = data_str.replace(/\s/gi,"");
      let data = parseInt(data_str);

      if (i == 0) {
        if (overlapCheck(dateKey)){
          overlap = false;
          accumulateData[accumulateData.length] = {
            date: dateKey,
            confirm: data_str
          };
        }
        else 
        {
          overlap = true;
          accumulateData[accumulateData.length - 1]["confirm"] = data_str;
        }
      } 
      else if (i == 1)
        accumulateData[accumulateData.length - 1]["unlock"] = data_str;
      else if (i == 2)
        accumulateData[accumulateData.length - 1]["die"] = data_str;

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

        confirm = parseInt(confirm);
        
        die = parseInt(die);
          
        countryList[i - 4] = {
              country: country,
              confirm: confirm,
              die: die
            };
      } 
      else
      {
        temp = parseInt(temp);
        countryList[i - 4] = {
            country: country,
            confirm: temp,
            die: 0
        };
      }
    }
  });

  // 저장 중복 검사
  if(!overlap){
    
    const addDate = [];
    addDate.push(accumulateData[accumulateData.length-1]);
    csvWriter.writeRecords(addDate)
    .then(()=>{
      log("CSV 파일 저장 성공!");
    });
  }
  overlap = false;
  const data = {
    domestic: ulList,
    foreign: countryList
  };
  return data;
}

//서버 시작시 한번 동작
getHtmlDomestic()
  .then(html=>{
    let res = getLocalData(html);
    return res
  })
  .then(res =>{
    areaData = res;
    // log("국내별");
    // log(areaData);
  })

getHtml()
  .then(html => {
    let res = getGlobalData(html);
    return res;
  })
  .then(res => {
    coronaData = res.domestic;
    foreignData = res.foreign;
    // log("국가별");
    log(res);
    // log("누적");
    // log(accumulateData);
    return res;
  });


// 매시간(테스트용 1분마다)마다 데이터 크롤링 후 프론트로 전송
const j = schedule.scheduleJob("1 1 * * * *", function() {

  getHtmlDomestic()
    .then(html => {
      let res = getLocalData(html);
      return res
    })
    .then(res => {
      areaData = res;
      io.emit("areaData", areaData);
      // log("1시간 후 국내별");
      // log(res);
    });

  getHtml()
    .then(html => {
      let res = getGlobalData(html);
      return res;
    })
    .then(res => {
      coronaData = res.domestic;
      foreignData = res.foreign;
      let data = {
        accumulateData: accumulateData,
        coronaData: res.domestic,
        foreignData: res.foreign
      };
      // log("1시간 후 국가별");
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
    coronaData: coronaData,
    foreignData: foreignData
  };

  io.emit("coronaData", data);
  io.emit("areaData", areaData);
});
