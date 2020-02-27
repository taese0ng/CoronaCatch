const axios = require("axios");
const cheeiro = require("cheerio");
const log = console.log;

const getHtml = async () =>{
    try{
        return  await axios.get("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun=")
    }
    catch(err){
        console.error(err);
    }
};

getHtml()
    .then(html => {
        let ulList = []
        const $ = cheeiro.load(html.data);
        const $bodyList = $("div.bvc_txt ul.s_listin_dot").children('li')

        // 0: 확진환자 1: 확진환자 격리해제 2: 사망자 3: 검사진행
        $bodyList.each(function(i,elem){
            let txt = $(this).text();
            let title = txt.slice(1,txt.indexOf(')'));
            let data = txt.slice(txt.indexOf(')')+1, txt.length)
       
            ulList[i] = {
                title:title,
                data:data
            }
        })

        const data = ulList;
        return data;
    })
    .then(res => log(res))
