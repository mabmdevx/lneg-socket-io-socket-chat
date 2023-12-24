const MongoClient = require('mongodb').MongoClient;
const io = require('socket.io').listen(4000);

let mongodb_conn_string = 'mongodb://127.0.0.1/socket_chat';

/*
* Connect to MongoDB
*/
MongoClient.connect(mongodb_conn_string, function (err, db) {
    if (err) throw err;
    console.log('Connected to MongoDB');

    // Set db constants
    const socket_chat = db.db('socket_chat');
    const users = socket_chat.collection('users');
    const messages = socket_chat.collection('messages');


    /*
    * Connect to socket.io
    */
    io.on('connection', function (socket) {

        console.log('Connected to socket.io, ID: ' + socket.id);

        /*
        * Handle enter chat / log on
        */
        socket.on("username", function (username) {
            console.log(username);

            users.find().toArray(function (err, res) {
                if (err) throw err;
                socket.emit('users', res); 
            });

            messages.find().toArray(function (err, res) {
                if (err) throw err;
                socket.emit('messages', res); 
            });

            users.insertOne({socketID: socket.id, username: username});

            socket.broadcast.emit('logon', {
                socketID: socket.id,
                username: username
            });
        });

        /*
        * Handle log off
        */
        socket.on('disconnect', function () {
            console.log('User ' + socket.id + ' disconnected!');

            users.deleteOne({socketID: socket.id}, function () {
                socket.broadcast.emit('logoff', socket.id);
            });
        });

        /*
        * Handle chat input
        */
        socket.on('input', function (data) {

            if (data.publicChat) {
                messages.insertOne({username: data.username, message: data.message, date: data.date});
            }

            io.emit('output', data);
        });

        /*
        * Handle second user trigger
        */
        socket.on('secondUserTrigger', function (data) {
            socket.to(data.secondUserID).emit('secondUserChatWindow', data);
        });

    });


});