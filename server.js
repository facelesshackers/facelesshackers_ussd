//require modules
var Pusher = require('pusher')
var credentials = require('./cred')
var africastalking = require('africastalking')(credentials.AT)
var cors = require('cors')
var bodyParser = require('body-parser')
var Webtask = require('webtask-tools')
const serveStatic = require("serve-static")

//configure modules
var express = require('express')
var app = express()
// var port = 3000
var port = process.env.PORT || 3000
var path = require('path')
var serveStatic = require('serve-static');

var pusher = new Pusher(credentials.pusher)
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app = express();
app.use(serveStatic(__dirname + "/dist"));

const https = require('https');

// Serve home page and static files
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + "/index.html"))
})
app.use(express.static(__dirname + '/'))

//configure AT
var welcomeMsg = `CON Hello and welcome to Techfugees
health reporting system!
Enter your name to continue`

var orderDetails = {
    name: "",
    description: "",
    address: "",
    telephone: "",
    open: true
}
var lastData = "";

app.post('/order', function(req, res){
    console.log(req.body);
    var message = 'Hello' 

    var sessionId = req.body.sessionId
    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var text = req.body.text
    var textValue = text.split('*').length

    if(text === ''){
        message = welcomeMsg
    }else if(textValue === 1){
        message = "CON What emmergency are you reporting?"
        orderDetails.name = text;
    }else if(textValue === 2){
        message = `CON What is your location or the nearest landmark?
        1. Kakuma
        2. Kakuma 1
        3. Kakuma 2
        4. Kakuma 3`
        orderDetails.description = text.split('*')[1];
    }else if(textValue === 3){
        message = "CON What's your telephone number?"
        orderDetails.address = text.split('*')[2];
    }else if(textValue === 4){
        message = `CON Would you like to report this emmergency?
        1. Yes
        2. No`
        lastData = text.split('*')[3];
    }else{
        message = `END Thanks for your 
        report our emmergency team will contact
        you as soon as possible  `
        orderDetails.telephone = lastData   
    }
    
    res.contentType('text/plain');
    res.send(message, 200);

    console.log(orderDetails)
    if(orderDetails.name != "" && orderDetails.address != '' && orderDetails.description != '' && orderDetails.telephone != ''){
        pusher.trigger('orders', 'customerOrder', orderDetails)
    }
    if(orderDetails.telephone != ''){
        //reset data
    orderDetails.name= ""
    orderDetails.description= ""
    orderDetails.address= ""
    orderDetails.telephone= ""
    }

})
//listen on port 
app.listen(port, function(err, res){
    if(err) throw err
    console.log("Booming on the legendary port " + port)
})