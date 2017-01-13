var passport = require('passport');
var Account = require('./models/account');
var http = require('http');


module.exports = function (app) {
    
  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.get('/listing', function(req, res) {
      res.render('list', { });
  });

  app.post('/register', function(req, res) {
      Account.register(new Account({ username : req.body.username, admin : req.body.admin}), req.body.password, function(err, account) {
          if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
          }

          passport.authenticate('local')(req, res, function () {
            res.redirect('/chat');
          });
      });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/chat');
  });

    app.get('/chat', function (req, res) {
        //res.render('chat', { user : req.user });
        res.sendfile('views/chat.html');
    });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });


    /*
  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });
  */
  
};
