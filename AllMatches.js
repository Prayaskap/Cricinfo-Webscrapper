const cheerio = require('cheerio');
const request = require('request');
const Scorecardobj = require("./ScoreCard.js");



function extractallmatches(html){
    let $ = cheerio.load(html);
    let scorecardele = $("a[data-hover=Scorecard]");
  //  console.log(scorecardele.length);

    for(let i =0;i <scorecardele.length;i++){
     
       let scorecardlink = $(scorecardele[i]).attr("href");
       let scorecardfulllink = "https://www.espncricinfo.com/" + scorecardlink;
         
       Scorecardobj.gM(scorecardfulllink);
    }
}

module.exports = {
    extractallmatchesobj : extractallmatches 
}