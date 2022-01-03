
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
  
  function getMatchPage(url){
    request(url,cb);
  }


   function cb(error,response,html){
       if(error){
           console.log(error);
       }
       else{
           extractScorecard(html);
       }
   }

   function extractScorecard(html){
       let $ = cheerio.load(html);
       let inningsArr = $(".card.content-block.match-scorecard-table .Collapsible")
     //  let htmlStr = "";
       
     let descriptele = $(".header-info .description");
     let result = $(".event .status-text");

     let descriptarr = $(descriptele).text().split(",");
     let place = descriptarr[1].trim();
     let date = descriptarr[2].trim();
     result = $(result).text();

       for(let i =0;i <inningsArr.length;i++){
       //  htmlStr += $(inningsArr[i]).html();
          let team = $(inningsArr[i]).find(".header-title.label").text();
           team  = team.split("INNINGS")[0].trim();

           let opponentteamidx = i==0? 1:0;
           let opponentteam = $(inningsArr[opponentteamidx]).find(".header-title.label").text();
           opponentteam  = opponentteam.split("INNINGS")[0].trim();
             
           console.log(  place + " | " + date + " | " + team + " vs " + opponentteam) 

           let tables = $(inningsArr[i]).find(".table.batsman");
           let allRows = $(tables).find("tr");
           
           for(let j =0;j<allRows.length;j++){
               let allCol = $(allRows[j]).find("td");
               let isworthy = $(allCol[0]).hasClass("batsman-cell");
               
               if(isworthy == true){
               let Player = $(allCol[0]).text();
               let Runs = $(allCol[2]).text();
               let Balls = $(allCol[3]).text();
               let fours =  $(allCol[5]).text();
               let Sixes = $(allCol[6]).text();
               let StrikeRate = $(allCol[7]).text();


              // console.log(`${Player} ${Runs} ${Balls} ${fours} ${Sixes} ${StrikeRate}`);

              ProcessPlayer(opponentteam,team,Player,Runs,Balls,fours,Sixes,StrikeRate);
              }
           }

       }
     //  console.log(htmlStr);
   }

   module.exports ={
       gM : getMatchPage
   }
 
   function ProcessPlayer(opponentteam,team,Player,Runs,Balls,fours,Sixes,StrikeRate){
      let teamPath = path.join(__dirname,"ipl",team);
      dirCreator(teamPath);
      let PlayerPath = path.join(teamPath,Player + ".xlsx");
      let content = SheetReader(PlayerPath,Player);
      let PlayerObj = {
        opponentteam,
        Player,
        Runs,
        Balls,
        fours,
        Sixes,
        StrikeRate
      };
      content.push(PlayerObj);
      SheetWriter(content,PlayerPath,Player);
   }



   function SheetWriter(data,filePath,sheetname){

    let newWb = xlsx.utils.book_new();

    let newWs = xlsx.utils.json_to_sheet(data);
    
    xlsx.utils.book_append_sheet(newWb,newWs,sheetname);
    
   xlsx.writeFile(newWb,filePath);
}

function SheetReader(filePath,sheetname){
    if(fs.existsSync(filePath) == false){
    return [];
    }

    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}



function dirCreator(filePath){
  if(fs.existsSync(filePath) == false){
      fs.mkdirSync(filePath);
  }
 }

