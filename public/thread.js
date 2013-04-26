var app = angular.module('app', ['ngResource'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

function threadCtrl($scope, $http, $resource) {

  $scope.posts = window.initdata.posts;
  $scope.threadId = window.initdata.threadId;
  $scope.sortBtn = "Oldest";
  if($scope.postReverse) $scope.sortBtn = "Newest";
  $scope.postReverse = false;
  $scope.orderProp = 'age';
  $scope.socket = io.connect('http://localhost');

  $scope.socket.emit('subscribe', { 'id': $scope.threadId });
  $scope.socket.on('update', function(post){
    var newpost = new Post({threadId: post.threadId, user: post.user, age:post.age, body:post.body, postnum:post.postnum});
    $scope.$apply(function(){//force view update immediately.
      $scope.posts.push(newpost);
    });
  });

  var Post = $resource('/:threadId/post',
      { threadId: $scope.threadId }, 
      { //methods 
      });

  $scope.addPost = function () {
    if($scope.postBody){
      var newpost = new Post({threadId: $scope.threadId});
      newpost.user = $scope.postUser || 'No Name';
      newpost.age = new Date();
      newpost.body = $scope.postBody;

      $scope.postBody = '';
      //$scope.posts.push(newpost);

      newpost.$save();
    }
  };

  $scope.changeSort = function () {
    $scope.postReverse = !$scope.postReverse;
    if($scope.postReverse){
      $scope.sortBtn = "Newest";
    } else {
      $scope.sortBtn = "Oldest";
    }
  };

}


