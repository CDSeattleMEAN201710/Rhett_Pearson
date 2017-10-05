var express = require("express");
var app = express();
var session = require('express-session');
var path = require("path");
var bodyParser = require('body-parser');
app.use(session({secret: 'codingdojorocks'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render("index");
})
app.post('/results', function(req, res){
  console.log("POST DATA", req.body);
  res.render("results", req.body)
})
app.listen(8000, function() {
 console.log("listening on port 8000");
});
