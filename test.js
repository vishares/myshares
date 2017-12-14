var nodemailer = require("nodemailer");

var transporter =nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"vinodhec@gmail.com",
        pass:"vishares@gmail.com"
    },
    tls: { rejectUnauthorized: false }
});

var mailOptions={
    from:"vinodhec@gmail.com",
    to:"vishares@gmail.com",
    subject:"Test from Node",
    text:"text"
}


transporter.sendMail(mailOptions,(err,info)=>{
if(err){
    throw err;

}
else{
    console.log(info.response);
}
})