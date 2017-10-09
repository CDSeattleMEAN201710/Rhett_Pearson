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
  if (!req.session.count) {
    min = Math.ceil(0);
    max = Math.floor(100);
    req.session.count = Math.floor(Math.random() * (max - min)) + min;
  }
  if (!req.session.ansStr) {
    req.session.ansStr = ""
  }
  let answerStr = req.session.ansStr;
  console.log(req.session.count);
  res.render("index", {"answerStr": answerStr});
})

app.post('/results', function(req, res){
  // console.log(req.body.guess);
  if (req.body.guess == req.session.count){
    req.session.ansStr = "<p>You guessed right!</p><a href='/reset'><button type='button' name='button'>Reset</button></a>"
  } else if (req.body.guess <= req.session.count) {
    req.session.ansStr = "You guessed too low!"
  } else if (req.body.guess >= req.session.count) {
    req.session.ansStr = "You guessed too high!"
  }

  console.log(req.session.ansStr);
  res.redirect('/');
})
app.get('/reset', function(req, res){
  req.session.destroy();
  res.redirect('/');
})

app.listen(8000, function() {
 console.log("listening on port 8000");
});
