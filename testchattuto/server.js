var app = require('express')();
var http = require('http').Server(app);
var $ = require('jQuery');
//var MongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
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





MongoClient.connect("mongodb://localhost/testChat", function(error, db) {
    if (error) return funcCallback(error);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            io.emit('chat message', msg,getDateSendingMessage());
            var objNew = { message: msg, date: getDateSendingMessage() };
            db.collection("messages").insert(objNew, null, function (error, results) {
                if (error) throw error;

                console.log("Le document a bien été inséré");
            });
        });
    });



    console.log("Connecté à la base de données 'tesChat'");
});




MongoClient.connect("mongodb://localhost/testChat", function(error, db) {
    if (error) throw error;
    io.on('connection', function(socket) {
        db.collection("messages").find().toArray(function (error, results) {
            if (error) throw error;
            console.log(results);
            results.forEach(function (obj, i) {
                io.emit('chat message', obj.message, obj.date);

            });
        });
    });
});





var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:3000');
});
