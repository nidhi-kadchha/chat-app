const { Socket } = require('engine.io');
var express = require('express')
var app = express()
const cookieparser = require('cookie-parser');
const session = require('express-session');
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server);
const flash = require('connect-flash');
const msgmodel = require("./models/msg");
const usermodel = require('./models/user');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(flash());
//app.use(expressvalidator()); 
app.use(session({secret:'max',saveUninitialized:false,resave:false}));

var d = new Date();
var date = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
var time = d.getHours() + ":" + d.getMinutes() +":" + d.getSeconds();
var dd = date + "  " + time;

var messages;
var users = [];
var rooms = ['HTML','CSS','JAVA-SCRIPT','PHP','SQL'];

//on connection
io.sockets.on('connection', (socket) =>
{
    socket.roomname = 'HTML';
    console.log("a user connected");
    //on getting data from prompt box
    socket.on('add-data', (username) =>
    {
        socket.username = username;
        users.push(socket.username);
        socket.join('HTML');
        messages = msgmodel({date:dd});
        messages.save();
        socket.emit('broad', `. . . . . . you are connected to HTML channle . . . . . .`);
        socket.broadcast.to('HTML').emit('broad', `. . . . . . ${username} connected to this channle`);
        socket.broadcast.emit('userlist',users);
        socket.emit('updaterooms', rooms, 'HTML');
        
    });

    //fetching data on connection
    msgmodel.find().then(result =>
    {
        socket.emit('fetch', result, socket.roomname);
    });
    
    socket.emit('euserlist',[...users]);
    //sending msg
	socket.on('chatmsg', (data) =>
    {
        var id = messages._id;
        //saving into database and then showing message
        msgmodel.updateOne({_id:id},{$push:{msg:{room:socket.roomname,name:socket.username,data:data,time:time}}}).then(() =>
        {
            io.sockets.in(socket.roomname).emit('chatmsg', socket.username, data); 
        });
	});
    //on switching room
    socket.on('switchroom', (newroom) =>
    {
        socket.leave(socket.roomname);
        socket.join(newroom);
        socket.emit('broad', `. . . . . . you are connected to ${newroom} channle . . . . . .`);
        socket.broadcast.to(socket.roomname).emit('broad',`. . . . . . ${socket.username} has left this channle`);
        socket.roomname = newroom;
        //fetching data for display
        msgmodel.find().then(result =>
        {
            socket.emit('fetch', result, socket.roomname);
        });
        socket.broadcast.to(socket.roomname).emit('broad',`. . . . . . ${socket.username} has joined this channle . . . . . . `);
        socket.emit('updaterooms', rooms, newroom);
    })

    socket.on('disconnect', () =>
    {
        users.pop(socket.username);
        socket.broadcast.to(socket.roomname).emit('broad', `. . . . . . ${socket.username} disconnected from this channle`);
		socket.leave(socket.room);
    });
})

//routes
const home_r = require("./routes/home");
app.use('/',home_r);
const register_r = require("./routes/register");
app.use('/register',register_r);
const login_r = require("./routes/login");
app.use('/login',login_r);
const secret_r = require("./routes/secrets");
app.use('/secrets',secret_r);
const index_r = require("./routes/index");
app.use('/index',index_r);
const admin_secret_r = require("./routes/admin");
const { default: mongoose } = require('mongoose');
app.use('/admin',admin_secret_r);

//server
server.listen('3000', () => {console.log("Server Running At Port : 3000");});
