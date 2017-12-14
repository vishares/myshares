var fs=require("fs");
var RSI = require('technicalindicators').RSI;

var caculate=(err,data)=>{
if(err){
    throw err;
}
let close=[];

let contents=JSON.parse(data.toString()).Data;
 for(i=0;i<contents.length;i++){

    close.push(contents[i].Close);
  

}
var inputRSI = {
    values :close,
    period : 14
  };
  var calc=RSI.calculate(inputRSI);

  return calc.splice(calc.length-10);

  

  for(j=1;j<calc.length;j++){
      if(calc[j] > 68 || calc[j] <32){
       //   console.log(calc[j]+" : "+contents[j+13].Date);
      }
  }
}

module.exports={calculate:caculate};