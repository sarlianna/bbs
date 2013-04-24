//should this be here?
var app = angular.module('app', ['ngResource'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

//todo: Post.$save() doesn't work. <---- do this
//initial data should be a collection of Posts, I guess...
//auto upadate is stupid
function threadCtrl($scope, $http, $resource) {

  $scope.posts = window.initdata.posts;
  $scope.threadId = window.initdata.threadId;

  var Post = $resource('/:threadId/post',
      { threadId: $scope.threadId }, 
      { //methods 
      });

  $scope.addPost = function () {
    if($scope.postBody){
      var newpost = new Post({threadId: $scope.threadId});
      newpost.user = $scope.postUser ? $scope.postUser : 'No Name';
      newpost.age = new Date().getTime();
      newpost.body = $scope.postBody;

      $scope.postBody = '';
      $scope.posts.push(newpost);

      newpost.$save();
    }
  };

  $scope.orderProp = 'age';
}


