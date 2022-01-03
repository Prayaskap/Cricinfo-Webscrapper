const cheerio = require('cheerio');
const request = require('request');
const AllMAtchesObj = require('./AllMatches.js');
const fs = require("fs");
const path = require("path");

   const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
   const iplPath = path.join(__dirname,"ipl");
   dirCreator(iplPath);

   request(url,cb);
   function cb(error,response,html){
       if(error){
           console.log(error);
       }
       else{
           extractmatches(html);
       }
   }

   function extractmatches(html){
      let  $ = cheerio.load(html);
      let  linkele = $('a[data-hover="View All Results"]');
      let link = $(linkele).attr("href");
      let fulllink = "https://www.espncricinfo.com/" + link;
      
      extractall(fulllink);
   }

   function extractall(fulllink){
       request(fulllink,cb);

       function cb(error,response,html){
        if(error){
            console.log(error);
        }
        else{
           AllMAtchesObj.extractallmatchesobj(html);
        }
    }

   }

   function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
   }









