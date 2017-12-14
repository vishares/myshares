
var express =require("express");
var app=express();
let sseExpress = require('sse-express');
app.get('/updates', sseExpress, function(req, res) {
setInterval(()=>{
    res.sse('connected', {
        welcomeMsg: new Date()
      })
},2000);
       
 
});
app.listen(8081);