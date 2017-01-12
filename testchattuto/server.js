var app = require('express')();
var http = require('http').Server(app);
var $ = require('jQuery');
//var passport = require('passport');

//const session = require('express-session')
//const RedisStore = require('connect-redis')(session)



var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendfile('index.html');
});

/*app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())*/







//FOR JQUERY
/*require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});*/




function getDateSendingMessage() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var hh = today.getHours();
    var min = today.getMinutes();
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd + ' - ' + hh+':'+min;
    return today;
}


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg,getDateSendingMessage());
  });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:3000');
});
