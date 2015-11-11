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
                    scope.add_new_task('Create mock project', 'coding', 'ToDo', 'VIKAN', 'some description');
                    // promise.then(function(data) {
                    //     console.log('NEW TASK ID: ' + data._id.$oid);
                    //     var template = $('#hidden-template').html();
                    //     var new_task = template.replace('todo_template', data._id.$oid.toString());
                    //     var $todo = $('#todo');
                    //     $todo.append(new_task);
                    //     $("> div", $todo).draggable({
                    //         cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    //         revert: "invalid", // when not dropped, the item will revert back to its initial position
                    //         containment: "document",
                    //         helper: "clone",
                    //         cursor: "move"
                    //     });
                    //     $('.editable').editable();
                    // });
                }
                element.on('click', functionToBeCalled);
            }
        }
    })
    .directive('delTaskDir', function() {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {
                function functionToBeCalled() {
                    scope.delete_task(attrs.id);
                    // console.log("Delete task: "+attrs.id);
                    // var $task = $('#'+attrs.id);
                    // $task.empty();
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

    $scope.task_user = "task user";
    // $scope.setUser = function(user) {
    //     $scope.taskUser = user;
    // }

    $scope.query_tasks = function() {
        $scope.method = 'GET';
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task?apiKey=MUB9xFbstbjdkOkoub_h_40gdV_KX4lm';
        $http({
            method: $scope.method,
            url: $scope.url,
            cache: $templateCache
        }).
        success(function(data) {
            console.log("query_tasks");
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
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
        }).
        success(function(data) {
            console.log("Add new task result!");
            console.log(data);
            $scope.todo_tasks.push(data);
        });
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
        $scope.url = 'https://api.mongolab.com/api/1/databases/vikanban/collections/task/' + id + '?apiKey=' + $scope.apiKey;
        $http({
            method: 'DELETE',
            url: $scope.url,
            data: {},
            cache: $templateCache
        }).then(function(response){
            var tasks = [];
            for (var i in $scope.todo_tasks) {
                var task = $scope.todo_tasks[i];
                if ('_id' in task && task._id.$oid != id) {
                    tasks.push(task);
                }
            }
            $scope.todo_tasks = tasks;
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


/*$scope.add_new_task('Connect MongoLab DB', 'test', 'Done', 'Scott', 'Create db in MongoLab');
$scope.add_new_task('DB interface', 'coding', 'Doing', 'Scott', 'JS functions for DB');
$scope.add_new_task('Frontent page', 'coding', 'Done', 'Rockie', 'Use angularJS to create page');
$scope.add_new_task('Task drag-drop', 'coding', 'Doing', 'Rockie', 'Make task dragable and dropable');
$scope.add_new_task('Delete task', 'coding', 'Done', 'Robin', 'Delete done tasks');
$scope.add_new_task('Move task', 'coding', 'Doing', 'Robin', 'Move task into different status');
$scope.add_new_task('Authentication', 'coding', 'ToDo', 'VIKAN', 'User login');
$scope.add_new_task('Support IPad', 'coding', 'ToDo', 'VIKAN', 'Let the page support IPad');*/

    //  $scope.add_new_task('Done task', 'test', 'Done', 'Rockie', 'Add a Done task in mongo db');
    //  $scope.update_task('5628c903e4b0bf8fc40631f7', 'Updated task', 'test', 'ToDo', 'Rockie', 'Update task in mongo db');
    //  $scope.delete_task('5628df76e4b07a7ab89612ea');
    //  $scope.archive_task('5628c99ee4b026215dd705db');


    $scope.query_tasks();
});