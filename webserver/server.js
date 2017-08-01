var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://mongodb:27017', function (err, db) {
  if (err) throw err
  console.log('Connected to MongoDB at port 27017!');
})


app.get('/', function(req, res){
  res.send("Hello Boyang, Start Coding Now!");
});

app.listen(8080, function(){
  console.log('Example app listening on port 8080!');
});
