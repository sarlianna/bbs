//should this be here?
var app = angular.module('app', ['ngResource'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

//todo:
//initial data should be a collection of Posts, I guess... (this doesn't really seem to matter, angular sorts them and such just fine)
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
      newpost.user = $scope.postUser || 'No Name';
      newpost.age = new Date();
      newpost.body = $scope.postBody;

      $scope.postBody = '';
      $scope.posts.push(newpost);

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

  $scope.sortBtn = "Oldest";
  $scope.postReverse = false;
  $scope.orderProp = 'age';
}


