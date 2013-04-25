var databaseUrl = "bbs";//"username:password@yes.com/mydb
var collections = ["posts", "threads"];
var mongojs     = require("mongojs");
var db          = mongojs(databaseUrl, collections);
//var io          = require("./io")();

var util        = require("./util");

module.exports = {

  "index" : function(req, res, next){
    db.threads.find({'public':"on"}).sort({age: -1}).limit(20, function(err, docs){
       if(err) res.render('servererror');
       res.render('index', { threads: docs });
    });
  },

  "posts" : function(req, res, next){
    var postdocs;
    db.posts.find({'thread': req.params.threadId }).sort({}, function(err, docs){
      postdocs = docs;
      db.threads.find({'id': req.params.threadId }, function(err, doc){
        if (err || !doc) console.log("Error retrieving thread: " + err);
        if(doc[0]) //for some reason this method gets called twice, once with a proper query and once without?  weird shit was happening, I dunno.
        res.render('thread', { 'title':doc[0].title, 'posts': postdocs, 'threadId': req.params.threadId });
      });
    });
  },

  "newthread" : function(req, res, next){
    var newid = util.generateUUID();
    var title = req.param('title') || "No Title";
    var pub = req.param('public');
    db.threads.save({'id': newid, 'title': title, 'public': pub, 'age': new Date(), 'postcount': 0 }, function(err, docs){
      if(err) res.render('servererror');
    });
    res.redirect('/' + newid);
  },

  //todo: add user id (ip-specific) to posts, maybe hash ip?
  "addpost" : function(req, res, next){
    if(req.body.body){
      var user = req.body.user || 'No name';
      //change thread age to reflect latest post, and get access to it so we can get the postcount
      db.threads.findAndModify({ query: { 'id': req.params.threadId }, 
                                  update: { $set: { 'age': new Date() }, $inc: {'postcount': 1} }, 
                                  new: true}, function(err, docs){

        db.posts.save({'user':user, 'body':req.body.body, 'age': new Date(), 'thread': req.params.threadId, 'postnum':docs.postcount }, function(err, doc){
          res.send(doc);
          //io.sockets.in(req.params.threadId).emit('update', doc);
        });
      });
    } else {
      res.status('400').render('error.json', { error: "Unacceptable data.", message: "Post needs a body."});
    }
  },

  "postjson" : function(req, res, next){
    db.posts.find({'thread' : req.params.threadId }, function(err, docs){
      if(!docs || err){
        res.render('servererror');
      }
      res.render('posts.json', { posts: docs });
    });
  }
};
