var App = angular.module('kanban', [])
    .directive('myRepeatDirective', function() {
        return function(scope, element, attrs) {
            console.log(angular.element(element));
            var $todo = $('#todo');
            $("div", $todo).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
            });
            $('.editable').editable();
        };
    })
    .directive('addTaskDir', function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {
                function functionToBeCalled() {
                    var promise = scope.add_new_task('Create mock project', 'coding', 'ToDo', 'VIKAN', 'some description');
                    promise.then(function(data) {
                        console.log('NEW TASK ID: ' + data._id.$oid);
                        var template = $('#hidden-template').html();
                        var new_task = template.replace('todo_template', data._id.$oid.toString();
                        var $todo = $('#todo');
                        $todo.append(new_task);
                        $("> div", $todo).draggable({
                            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                            revert: "invalid", // when not dropped, the item will revert back to its initial position
                            containment: "document",
                            helper: "clone",
                            cursor: "move"
                        });
                        $('.editable').editable();
                    });
                }
                element.on('click', functionToBeCalled);
            }
        }
    });

App.controller('task_ctrl', function($scope, $http, $q, $templateCache) {

    $scope.apiKey = 'MUB9xFbstbjdkOkoub_h_40gdV_KX4lm';

    $scope.todo_tasks = [];
    $scope.doing_tasks = [];
    $scope.done_tasks = [];

    $scope.query_tasks = function() {
        $scope.method = 'GET';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task?apiKey=MUB9xFbstbjdkOkoub_h_40gdV_KX4lm';
        $http({
            method: $scope.method,
            url: $scope.url,
            cache: $templateCache
        }).
        success(function(data) {
            var arrayLength = data.length;
            for (var i = 0; i < arrayLength; i++) {
                task = data[i];
                console.log(task);
                if (task.status == 'ToDo') {
                    $scope.todo_tasks.push(task);
                } else if (task.status == 'Doing') {
                    $scope.doing_tasks.push(task);
                } else if (task.status == 'Done') {
                    $scope.done_tasks.push(task);
                }
            }
        });
    };

    $scope.add_new_task = function(title, type, status, owner, description) {
        $scope.method = 'POST';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task?apiKey=' + $scope.apiKey;
        $scope.data = {
            "title": title,
            "type": type,
            "status": status,
            "owner": owner,
            "description": description
        };
        var defer = $q.defer();
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            cache: $templateCache
        }).
        success(function(data) {
            console.log("Add new task result!");
            console.log(data);
            defer.resolve(data);
        });
        return defer.promise;
    };

    $scope.update_task = function(id, title, type, status, owner, description) {
        $scope.method = 'PUT';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/' + id + '?apiKey=' + $scope.apiKey;
        $scope.data = {
            "title": title,
            "type": type,
            "status": status,
            "owner": owner,
            "description": description
        };
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            cache: $templateCache
        });
    };

    $scope.delete_task = function(id) {
        $scope.method = 'DELETE';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/' + id + '?apiKey=' + $scope.apiKey;
        $http({
            method: $scope.method,
            url: $scope.url,
            cache: $templateCache
        });
    }

    $scope.archive_task = function(id) {
        $scope.method = 'PUT';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/' + id + '?apiKey=' + $scope.apiKey;
        $scope.data = {
            "$set": {
                "status": "Archived"
            }
        };
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            cache: $templateCache
        });
    }


    //  $scope.add_new_task('Done task', 'test', 'Done', 'Rockie', 'Add a Done task in mongo db');
    //  $scope.update_task('5628c903e4b0bf8fc40631f7', 'Updated task', 'test', 'ToDo', 'Rockie', 'Update task in mongo db');
    //  $scope.delete_task('5628df76e4b07a7ab89612ea');
    //  $scope.archive_task('5628c99ee4b026215dd705db');


    $scope.query_tasks();
});