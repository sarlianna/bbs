//俺だめですか・・・
//死ぬほうがいいと思う
//まあいい
//頑張ってみようか？
//
//goals: -threads
//THREADS DONE CHECK man that only took me like an hour.
//-angular + realtime aspect
//-modularity/reusability etc

//features that would be nice
//-replies (just short links to other posts, basically all front end)
//-links
//-image/video embedding

var http      = require ('http');
var express   = require ('express');
var cons      = require ('consolidate');
var app       = express();

var controllers = require('./posts');

app.set('title', 'Lazy BBS - Colton\'s archenemy');
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

if (!module.parent) app.use(express.logger('dev'));
app.use("/public",express.static( __dirname + '/public'));
app.use(express.bodyParser());

app.get('/', function( req, res){
  res.render('index');
});

app.get('/newthread', function( req, res ){
  controllers.newthread(req, res);
});

app.get('/browse', function( req, res){
  controllers.browsethreads(req, res);
});

app.get('/:threadId', function( req, res ){
  controllers.posts(req, res);
});

app.post('/:threadId/post', function( req, res ){
  controllers.addpost(req, res);
});

app.get('/:threadId/newposts', function( req, res ){
  controllers.newposts(req, res);
});

app.listen(8000);
console.log("Listening on port 8000...");
