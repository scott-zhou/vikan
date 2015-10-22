var App = angular.module('drag-and-drop', ['ngDragDrop']);

App.controller('oneCtrl', function($scope, $timeout, $filter, $http, $templateCache) {

  $scope.apiKey = 'MUB9xFbstbjdkOkoub_h_40gdV_KX4lm';

  $scope.filterIt = function() {
    return $filter('orderBy')($scope.list2, 'title');
  };


  $scope.list1 = [{ 'title': 'Default doing task', 'drag': true }];
  $scope.list2 = [{ 'title': 'Default ToDo task', 'drag': true }];

  $scope.query_tasks = function(){
    $scope.method = 'GET';
    $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task?apiKey=MUB9xFbstbjdkOkoub_h_40gdV_KX4lm';
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        success(function(data) {
          var arrayLength = data.length;
          for(var i = 0; i < arrayLength; i++) {
            task = data[i];
            console.log(task);
            if(task.status == 'ToDo') {
              $scope.list2.push({'title': task.title, 'drag': true});
            }
            else {
              $scope.list1.push({'title': task.title, 'drag': true});
            }
            
          }
        });
  };

  $scope.add_new_task = function(title, type, status, owner, description){
    $scope.method = 'POST';
    $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task?apiKey='+$scope.apiKey;
    $scope.data = { "title" : title, "type" : type, "status" : status, "owner" : owner, "description" : description};
    $http({method: $scope.method, url: $scope.url, data: $scope.data, cache: $templateCache});
  };

  $scope.update_task = function(id, title, type, status, owner, description){
    $scope.method = 'PUT';
    $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/'+id+'?apiKey='+$scope.apiKey;
    $scope.data = { "title" : title, "type" : type, "status" : status, "owner" : owner, "description" : description};
    $http({method: $scope.method, url: $scope.url, data: $scope.data, cache: $templateCache});
  };

  $scope.delete_task = function(id) {
    $scope.method = 'DELETE';
    $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/'+id+'?apiKey='+$scope.apiKey;
    $http({method: $scope.method, url: $scope.url, cache: $templateCache});
  }

  $scope.archive_task = function(id) {
    $scope.method = 'PUT';
    $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/'+id+'?apiKey='+$scope.apiKey;
    $scope.data = { "$set" : { "status" : "Archived" } };
    $http({method: $scope.method, url: $scope.url, data: $scope.data, cache: $templateCache});
  }

//  $scope.add_new_task('Done task', 'test', 'Done', 'Rockie', 'Add a Done task in mongo db');
//  $scope.update_task('5628c903e4b0bf8fc40631f7', 'Updated task', 'test', 'ToDo', 'Rockie', 'Update task in mongo db');
//  $scope.delete_task('5628df76e4b07a7ab89612ea');
//  $scope.archive_task('5628c99ee4b026215dd705db');
  $scope.query_tasks();

  angular.forEach($scope.list2, function(val, key) {
    $scope.list1.push({});
  });
});