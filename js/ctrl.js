(function () {
	'use strict';

	var todo_list = angular.module('todo_list', ['firebase']);

	function TodoCtrl($scope, $firebaseArray) {
		var url = 'https://manolof-todo-list.firebaseio.com/Todos';
		var todosRef = new Firebase(url);

		$scope.appTitle = "Emmanouil Todo List";

		$scope.todos = $firebaseArray(todosRef);

		$scope.$watch('todos', function () {
			var total = 0;
			var remaining = 0;
			var doneCount = 0;
			$scope.todos.forEach(function (todo) {
				if (!todo || !todo.text) { // filter tasks
					return;
				}

				total++;
				if (todo.isCompleted === false) { // Calculate remaining tasks
					remaining++;
				}
				if (todo.done === false) {
					doneCount++;
				}
			});
			$scope.totalCount = total;
			$scope.remainingCount = remaining;
			$scope.doneCount = doneCount;
			$scope.completedCount = total - remaining;
		}, true);

		// Add new todo
		$scope.addTodo = function () {
			// Create a unique ID
			var id = new Date().valueOf();

			$scope.todos.$add({
				id: id,
				text: $scope.todoText,
				done: false,
				isCompleted: false,
				priority: false
			});

			$scope.todoText = "";

		};

		$scope.archive = function () {
			var rusure = confirm("Are you sure you want to remove the completed tasks from the list?");
			if (rusure) {
				angular.forEach($scope.todos, function (item) {
					if (item.done && !item.isCompleted && !angular.isFunction(item)) {
						item.isCompleted = true;
						$scope.todos.$save(item);
					}
				});
			}
		};

		$scope.delete = function (item) {
			var rusure = confirm("Are you sure you want to remove the task from the list?");
			if (rusure) {
				if (item.id === undefined) {
					return;
				}
				$scope.todos.$remove(item);
			}
		};

		$scope.edit = function (item) {
			var changes = prompt("Please make the changes below", item.text);
			if (changes !== null) {
				if (item.id === undefined) {
					return;
				}
				item.text = changes;
				$scope.todos.$save(item);
			}
		};

		$scope.priority = function (item, val) {
			if (item.id === undefined) {
				return;
			}
			item.priority = (item.priority === val) ? 0 : val;
			$scope.todos.$save(item);
		};

		// Update the "completed" status
		$scope.checkboxClick = function (item) {
			if (item.id === undefined) {
				return;
			}
			item.done;
			$scope.todos.$save(item);
		};

		$scope.todos.$loaded().then(function () {
			var body = document.body;
			console.log(body);
			body.className += 'revealed';
		});

	}

	angular
		.module('todo_list')
		.controller('TodoController', TodoCtrl);
}());