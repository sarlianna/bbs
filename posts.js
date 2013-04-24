var databaseUrl = "bbs";//"username:password@yes.com/mydb
var collections = ["posts", "threads"];
var mongojs     = require("mongojs");
var db          = mongojs(databaseUrl, collections);

var util        = require("./util");

module.exports = {

//todo: render threads with their title
  "posts" : function(req, res, next){
    var postdocs;
    db.posts.find({'thread': req.params.threadId }).sort({}, function(err, docs){
      postdocs = docs;
      db.threads.find({'id': req.params.threadId }, function(err, docs){
        res.render('thread', { 'title':docs.title, 'posts': postdocs, 'threadId': req.params.threadId });
      });
    });
  },

  "newthread" : function(req, res, next){
    var newid = util.generateUUID();
    var title = req.param('title') ? req.param('title') : "No Title";
    var pub = req.param('public');
    db.threads.save({'id': newid, 'title': title, 'public': pub, 'age': new Date() }, function(err, docs){
      if(err || !docs){
        res.render('servererror');
      }
    });
    res.redirect('/' + newid);
  },

  "browsethreads" : function(req, res, next){
    db.threads.find({'public':"on"}).sort({age: -1}, function(err, docs){
       if(!docs || err){
          res.render('servererror');
       }     
       res.render('browse', { threads: docs });
    });
  },

  //todo: add user id (ip-specific) to posts, maybe hash ip?
  // add check to make sure valid thread is being passed
  "addpost" : function(req, res, next){
    if(req.body.body){
      var user = req.body.user ? req.body.user : 'No name';
      db.posts.save({'user':user, 'body':req.body.body, 'age': new Date(), 'thread': req.params.threadId }, function(err, doc){
         res.send(doc);
      });
      //change thread age to reflect latest post
      db.threads.findAndModify({ query: { 'id': req.params.threadId }, update: { $set: { 'age': new Date() } }, new: true}, function(err, docs){ });
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
