var app = require('express')();
var http = require('http').Server(app);
//var MongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
    var messageSchema = new mongoose.Schema({
        message: String
        , date: String
    });

    var Message = mongoose.model('Message', messageSchema);

    io.on('connection', function(socket) {
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



mongoose.connect('mongodb://localhost/testChat');




var io = require('socket.io')(http);
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;


app.get('/', function(req, res){
  res.sendfile('index.html');
});


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






var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:3000');
});

