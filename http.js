var request = require("request");
var program = require('./program');
var async = require("async");
var express = require("express");
var fs = require("fs");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

finalResponse = [];
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
let headers = {
    "UserID": "ZyT47UW2g56",
    "Password": "H98qlU4Sn2",
    "Content-Type": "application/json",
    "host": "okhttp/3.9.0",
    "cookie": "5paisacookie=kf0sgok3p4skljsp0py1oeik; path=/; httponly=",
    "host": "swaraj.5paisa.com",
}


getWatchList = {
    url: "https://swaraj.5paisa.com/Mob/Service1.svc/v3/GetNewMarketWatch", body: JSON.stringify({
        "Clientcode": "50943954",
        "MWName": "WATCHLIST3",
        "ClientLoginType": 0
    }), headers: headers, proxy: "http://127.0.0.1:8888"
}
// getWatchList = {
//     url: "http://127.0.0.1:8081/test1.json", body: JSON.stringify({
//         "Clientcode": "50943954",
//         "MWName": "WATCHLIST3",
//         "ClientLoginType": 0
//     }), headers: headers
// }

getIntradayChart = {
    proxy: "http://127.0.0.1:8888", url: "https://swaraj.5paisa.com/Mob/Service1.svc/IntradayChart", body: JSON.stringify({ "Exch": "N", "ExchType": "C", "ScripCode": "11460", "ClientLoginType": 0, "LastRequestTime": "/Date(0)/" }), headers: headers
}

// getIntradayChart = {
//     url: "http://127.0.0.1:8081/test.json", body: JSON.stringify({ "Exch": "N", "ExchType": "C", "ScripCode": "11460", "ClientLoginType": 0, "LastRequestTime": "/Date(0)/" }), headers: headers
// }


var responseObj;
var finalResult 
app.get("/", (req, res) => {


console.log(req.url);
    responseObj = res;
    fs.readFile("./scrips.json", (err, body) => {
        let urls = JSON.parse(body.toString()).data;
        async.map(urls, (temp, cb) => {
            request.post({
                url: "https://swaraj.5paisa.com/Mob/Service1.svc/IntradayChart", body: JSON.stringify({ "Exch": temp.Exch, "ExchType": temp.ExchType, "ScripCode": temp.ScripCode, "ClientLoginType": 0, "LastRequestTime": "/Date(0)/" }), headers: headers
            },
                (error, response, body1) => {
                    if (!error && response.statusCode == 200) {
                        let RSI = program.calculate(null, body1);
                        cb(null, { RSI });
                    }
                }
            );
        }, (err, results) => {
             
            // responseObj.send(results);
      
            results.forEach((data, index) => {
                results[index] = Object.assign(data,finalResult[index]);

            })
            responseObj.send(results);


        })

        async.map(urls, (temp, cb) => {
                            request.post({
                                url: "https://swaraj.5paisa.com/Mob/Service1.svc/CompanyDetailPage", body: JSON.stringify({
                                    "Exch": temp.Exch, "ExchType": temp.ExchType, "RefreshRate": "H",
                                    "Count": 1, "ScripCode": temp.ScripCode, "ClientLoginType": 0, "LastRequestTime": `/Date(${new Date().getTime()})/`
                                }), headers: headers
                            },
                                (error, response, body1) => {
                                    if (!error && response.statusCode == 200) {
                                        let {  ExposureCategory,FullName, AHigh, LastRate, TickDt, ALow, ScripCode, TotalQty, PClose,OpenRate, High, Low,LastQty  } = JSON.parse(body1).Data[0];
                                       // let RSI = program.calculate(null, body1);
                                        cb(null, Object.assign({FullName:temp.FullName},{ ExposureCategory, AHigh, LastRate, TickDt, ALow, ScripCode, TotalQty, PClose,OpenRate, High, Low,LastQty }));
                                    }
                                }
                            );
                        }, (err, results) => {
                            finalResult = results;
                        })

    }


    );
});
app.get("/updateMargin", (req, res) => {

    request.post({ url: "https://swaraj.5paisa.com/Mob/Service1.svc/v2/Margin", body: "50943954", headers: headers },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.setHeader("Content-Type", "application/json");
                res.send(body);
            }
        });


})


app.get("/getTopTraded", (req, res) => {
    
        request.post({ url: "https://swaraj.5paisa.com/Mob/Service1.svc/TopTradedDashBoard", body: JSON.stringify({
            "head": {
                "appName": "5PTRADE",
                "appVer": "1.0",
                "key": "8eeee59bdab88bace6189d001f96487e",
                "osName": "Android",
                "requestCode": "5PJanTTDB"
            },
            "body": {
                "Exch": "N",
                "ExchType": "C",
                "ClientLoginType": 0,
                "ScripCount": 22
            }
        }), headers: headers },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.setHeader("Content-Type", "application/json");
                    res.send(body);
                }
            });
    
    
    })
    

app.listen(server_port, server_ip_address,, () => {
    console.log("listening");
    console.log( "Listening on " + server_ip_address + ", port " + server_port 
})
