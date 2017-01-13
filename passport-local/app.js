// dependencies
var path = require('path');
var express = require('express');
//var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);

var app    = require('express')();





// main config

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(app.get('port'), function () {
    console.log('server listening on port ' + server.address().port);
});
var io = require('socket.io')(server);


app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/testpass');

// routes
require('./routes')(app);

/*app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});*/



// LE CHAT


var db = mongoose.connection;

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});


db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.

    var messageSchema = new mongoose.Schema({
        message: String
        , date: String
    });

    var Message = mongoose.model('Message', messageSchema);

    io.on('connection', function(socket) {


        console.log("test");
        Message.find(function (err, messages) {
            if (err) return console.error(err);

            messages.forEach(function (obj, i) {
                //console.log(obj.message + "  ---   " + obj.date);
                console.log(messages.length);
                if (messages.length > 30) {
                    obj.remove();
                    messages.length --;
                    //db.messages.find({message: obj.message}).remove();

                    console.log("remove ???" + obj.message);

                }

                io.emit('chat message', obj.message, obj.date);


            });
        });
    });


    var adminList = mongoose.model('Account');

    io.on('', function(socket) {


        console.log("listing account");
        adminList.find(function (err, users) {
            if (err) return console.error(err);

            users.forEach(function (obj, i) {
                //console.log(obj.message + "  ---   " + obj.date);
                console.log(users.length);

                io.emit('list', obj.username, obj.admin);


            });
        });
    });



    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            io.emit('chat message', msg,getDateSendingMessage());


            var objNew = new Message({ message: msg, date: getDateSendingMessage() });
            objNew.save(function(err, objnew) { // save le message
                if (err) return console.error(err);
                //console.dir(objnew);
                console.log("Le document a bien été inséré");
            });




        });
    });




});







/*
app.get('/', function(req, res){
    res.sendfile('index.html');
});
*/




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








