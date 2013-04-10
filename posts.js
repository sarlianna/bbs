var databaseUrl = "bbs";//"username:password@yes.com/mydb
var collections = ["posts", "threads"];
var mongojs     = require("mongojs");
var db          = mongojs(databaseUrl, collections);

var util        = require("./util");

//todo: render threads with their title
exports.posts = function(req, res, next){
  db.posts.find({'thread': req.params.threadId }).sort({age:-1}, function(err, docs){
    res.render('thread', { posts: docs, threadId: req.params.threadId });
  });
};

exports.newthread = function(req, res, next){
  var newid = util.generateUUID();
  var title = req.param('title') ? req.param('title') : "No Title";
  var pub = req.param('public');
  db.threads.save({'id': newid, 'title': title, 'public': pub, 'age': new Date().getTime() });
  res.redirect('/' + newid);
};

exports.browsethreads = function(req, res, next){
  db.threads.find({'public':"on"}).sort({age: -1}, function(err, docs){
    res.render('browse', { threads: docs });
  });
};

//todo: add user id (ip-specific) to posts, maybe hash ip?
// add check to make sure valid thread is being passed
exports.addpost = function(req, res, next){
  if(req.body.post){
    var user = req.body.user ? req.body.user : 'No name';
    db.posts.save({'user':user, 'body':req.body.post, 'age': new Date().getTime(), 'thread': req.params.threadId });
    //change thread age to reflect latest post
    db.threads.findAndModify({ query: { 'id': req.params.threadId }, update: { $set: { 'age': new Date().getTime() } }, new: true}, function(err, docs){});
    res.redirect('/' + req.params.threadId);
  }
};

exports.newposts = function(req, res, next){
  var timestamp = req.param('time');
  if (timestamp){
    db.posts.find({'thread': req.params.threadId, 'age':{$gt:timestamp}}, function(err, docs){//this find isn't working, for some reason.
      res.render('posts', {posts: docs});
    });
  } 
}
