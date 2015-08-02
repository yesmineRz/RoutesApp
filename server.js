var express = require("express");
var app =express();
var oembed=require("oembed-auto");
var bodyParser = require("body-parser");
var request = require("request");

app.use(express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res,next){
  res.sendFile(__dirname + '/index.html');
});


app.listen(3000,function(){
  console.log("We are listening at 3000");
});