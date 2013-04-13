//does this go here?
var app = angular.module('app', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

function threadCtrl($scope) {
  $scope.posts = window.initdata.posts;

  $scope.addPost = function () {
    if($scope.postBody){
      var temp = $scope.postUser ? $scope.postUser : 'No Name';
      $scope.posts.push( { 'user': temp, 'age': new Date().getTime(), 'body': $scope.postBody });
      $scope.postBody = '';
    }
  };

  $scope.orderProp = 'age';
}


