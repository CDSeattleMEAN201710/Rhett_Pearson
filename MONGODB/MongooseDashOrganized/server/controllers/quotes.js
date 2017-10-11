var mongoose = require('mongoose');
var Dog = mongoose.model('Dog');
module.exports = {
  index: function(req, res){
    Dog.find({}, function(err, results) {
      if (err) {
        console.log(err);
      }
      res.render('index', {
        dogs: results
      })
    })
  },
  show: function(req, res) {
    Dog.find({
      _id: req.params.id
    }, function(err, response) {
      if (err) {
        console.log(err);
      }
      console.log(response);
      res.render('show', {
        dog: response[0]
      })
    })
  },
  create: function(req, res) {
    Dog.create(req.body, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/')
    })
  },
  new: function(req, res) {
    res.render('new');
  },
  edit: function(req, res) {
    Dog.find({
      _id: req.params.id
    }, function(err, response) {
      if (err) {
        console.log(err);
      }
      res.render('edit', {
        dog: response[0]
      })
    })
  },
  update: function(req, res) {
    Dog.update({
      _id: req.params.id
    }, req.body, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    })
  },
  delete: function() {
    Dog.remove({
      _id: req.params.id
    }, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    })
  }
}
