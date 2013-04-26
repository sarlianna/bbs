//俺だめですか・・・
//死ぬほうがいいと思う
//まあいい
//頑張ってみようか？
//
//todo: 
//-realtime aspect with websockets -- mostly done but needs to be emitted from controllers and not index
//-modularity/reusability etc
//-Navigation bar with recently visited threads easily available.  this could be really solid
//  Combine the above with angular handling thread navigations and the experience would be perfect.

//features that would be nice
//-replies (just short links to other posts, basically all front end)
//-links
//-image/video embedding

var http        = require ('http');
var express     = require ('express');
var cons        = require ('consolidate');
var app         = express();
var server      = http.createServer(app);
var io          = require ('socket.io').listen(server);
var controllers = require('./posts')(io);

app.set('title', 'Lazy BBS - Colton\'s archenemy');
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

if (!module.parent) app.use(express.logger('dev'));
app.use("/public",express.static( __dirname + '/public'));
app.use(express.bodyParser());

io.sockets.on('connection', function(socket){
  socket.emit('success');
  socket.on('subscribe', function(thread){
    socket.join(thread.id);
  });
});

app.get('/', controllers.index);

app.get('/about', function(req, res){ res.render('about'); });

app.get('/newthread', controllers.newthread);

app.get('/:threadId', controllers.posts);

app.get('/:threadId/post', controllers.postjson);

app.post('/:threadId/post', controllers.addpost);
});

server.listen(8000);
console.log("Listening on port 8000..."); 
