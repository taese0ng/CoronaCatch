const axios = require("axios");
const cheeiro = require("cheerio");
const log = console.log;
const express = require("express");
const app = express();
const server = app.listen(3000, function() {
    console.log("Listening on port *: 3000");
  });
const request = require("request");

const schedule = require("node-schedule");

var coronaData = [];

const io = require("socket.io")(server);

app.use(express.static("dist"));

const getHtml = async () =>{
    try{
        return  await axios.get("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun=")
    }
    catch(err){
        console.error(err);
    }
};

//서버 실행 시 데이터 크롤링
getHtml()
        .then(html => {
            let ulList = []
            const $ = cheeiro.load(html.data);
            const $bodyList = $("div.data_table table.num tbody").children('tr')

            // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
            $bodyList.each(function (i, elem) {
                let title = $(this).children('th').text();
                let data = $(this).children('td').text();

                ulList[i] = {
                    title: title,
                    data: data
                }
            })
            // console.log(ulList)
            const data = ulList;
            return data;
        })
        .then(res => {
            coronaData = res;
            log(coronaData);
});


// 매시간(테스트용 1분마다)마다 데이터 크롤링 후 프론트로 전송
const j = schedule.scheduleJob('1 * * * * *',function(){
    getHtml()
        .then(html => {
            let ulList = []
            const $ = cheeiro.load(html.data);
            const $bodyList = $("div.data_table table.num tbody").children('tr')

            // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
            $bodyList.each(function (i, elem) {
                let title = $(this).children('th').text();
                let data = $(this).children('td').text();

                // let title = txt.slice(1,txt.indexOf(')'));
                // let data = txt.slice(txt.indexOf(')')+1, txt.length)

                ulList[i] = {
                    title: title,
                    data: data
                }
            })
            // console.log(ulList)
            const data = ulList;
            return data;
        })
        .then(res => {
            coronaData = res;
            log(coronaData);
            
            io.emit("coronaData",res)
        });
    });

io.on("connection", socket => {
    console.log(socket.client.id); // Prints client socket id
    //console.log(socket.id);

    io.to(socket.client.id).emit("newUser",coronaData);
    
});
