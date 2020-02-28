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

var accumulateData = [{date:"2/18", num:31},{date:"2/19",num:51},{date:"2/20",num:104},{date:"2/21",num:204},{date:"2/22",num:433},{date:"2/23",num:602},{date:"2/24",num:833},{date:"2/25",num:977},{date:"2/26",num:1261},{date:"2/27",num:1766}]

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

//중복제외 검사

const overlapCheck = function(dateKey){
    if(accumulateData[accumulateData.length-1]['date'] != dateKey)
        return true;
    return false;
}


//서버 실행 시 데이터 크롤링
getHtml()
        .then(html => {
            let date = new Date();
            let month = date.getMonth()+1;
            let day = date.getDate();
            
            let dateKey = ''+month+'/'+day
            let ulList = []
            const $ = cheeiro.load(html.data);
            const $bodyList = $("div.data_table table.num tbody").children('tr')

            // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
            $bodyList.each(function (i, elem) {
                let title = $(this).children('th').text();
                let data_str = $(this).children('td').text();
                data_str = data_str.replace(/,/gi,'').replace(/명/gi,'').replace(/ /gi,'');
                let data = parseInt(data_str)

                //0번 이면서 데이터가 있지 않으면 
                if(i == 0)
                {
                    if(overlapCheck(dateKey))
                        accumulateData[accumulateData.length] = {date:dateKey, num:data};
                    else
                        accumulateData[accumulateData.length-1]['num'] = data;
                }

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
            log(accumulateData)
            coronaData = res;
            log(coronaData);
});



// 매시간(테스트용 1분마다)마다 데이터 크롤링 후 프론트로 전송
const j = schedule.scheduleJob('1 * * * * *',function(){
    let date = new Date();
    let month = date.getMonth()+1;
    let day = date.getDate();
    
    let dateKey = ''+month+'/'+day
    
    //없는 key (새로 들어오는 데이터면 초기화)



    getHtml()
        .then(html => {
            let ulList = []
            const $ = cheeiro.load(html.data);
            const $bodyList = $("div.data_table table.num tbody").children('tr')

            // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
            $bodyList.each(function (i, elem) {
                let title = $(this).children('th').text();
                let data_str = $(this).children('td').text();
                data_str = data_str.replace(/,/gi,'').replace(/명/gi,'').replace(/ /gi,'');
                let data = parseInt(data_str)
                // let title = txt.slice(1,txt.indexOf(')'));
                // let data = txt.slice(txt.indexOf(')')+1, txt.length)

                if(i == 0)
                {
                    if(overlapCheck(dateKey))
                        accumulateData[accumulateData.length] = {date:dateKey, num:data};
                    else
                        accumulateData[accumulateData.length-1]['num'] = data;
                }
                    // accumulateData[accumulateData.length-1]['date'] = dateKey;

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
            // log(coronaData);

            io.emit("accumulateData",accumulateData)
            io.emit("coronaData",res)
        });
    });

io.on("connection", socket => {
    console.log(socket.client.id); // Prints client socket id
    //console.log(socket.id);

    io.to(socket.client.id).emit("coronaData",coronaData);
    io.to(socket.client.id).emit("accumulateData",accumulateData);
    
});
