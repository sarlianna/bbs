//does this go here?
var app = angular.module('app', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

function threadCtrl($scope) {
  $scope.posts = window.initdata.posts;


}
