var quotes = require('../controllers/quotes.js');
module.exports = function(app) {
  // console.log("TEST______________________________________________________");
  app.get('/', function(req, res) {
    quotes.index(req, res)
  })
  app.post('/', function(req, res) {
    quotes.create(req, res)
  })
  app.get('/new', function(req, res) {
    // console.log("NEW RENDER TEST");
    res.render('new');
  })
  app.get('/:id', function(req, res) {
    quotes.show(req, res)
  })
  app.get('/:id/edit/', function(req, res) {
    quotes.edit(req, res)
  })
  app.post('/:id', function(req, res) {
    quotes.update(req, res)
  })
  app.post('/:id/delete', function(req, res) {
    quotes.delete(req, res)
  })
}
