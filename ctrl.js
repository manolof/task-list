var myApp = angular.module('Todo', ['firebase']);

myApp.constant("FIREBASE_URL_TODOS", "https://sizzling-torch-2777.firebaseio.com/Todos/")
  .constant("FIREBASE_URL_VARIABLES", "https://sizzling-torch-2777.firebaseio.com/Variables/")

function TodoController($scope, $firebase, FIREBASE_URL_TODOS, FIREBASE_URL_VARIABLES) {

  $scope.appTitle = "MAPC Project task list";

  // Get Stored TODOs
  var todosRef = new Firebase(FIREBASE_URL_TODOS);
  var varRef = new Firebase(FIREBASE_URL_VARIABLES);
  $scope.todos = $firebase(todosRef);
  $scope.variables = $firebase(varRef);

  $scope.todosList = $scope.todos.$asArray();
  $scope.varList = $scope.variables.$asArray();

  // Add new TODO
  $scope.addTodo = function() {
    console.log($scope.todoText);
    // Create a unique ID
    var timestamp = new Date().valueOf()

    // Get the Firebase reference of the item
    var itemRef = new Firebase(FIREBASE_URL_TODOS + timestamp);

    $firebase(itemRef).$set({
      id: timestamp,
      text: $scope.todoText,
      doneDev: false,
      doneProd: false,
      isCompleted: false,
      priority: 0
    });

    $scope.todoText = "";

  }

  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todosList, function(todo) {
      count += todo.doneProd && todo.doneDev && !angular.isFunction(todo) ? 0 : 1;
    });
    return count;
  };

  $scope.archive = function() {
    var rusure = confirm("Are you sure you want to remove the completed tasks from the list?");
    if (rusure) {
      angular.forEach($scope.todosList, function(item) {
        if (item.doneProd && item.doneDev && !item.isCompleted && !angular.isFunction(item)) {
          item.isCompleted = true;
          $scope.todosList.$save(item);
        }
      });
    }
  };

  $scope.delete = function(item) {
    var rusure = confirm("Are you sure you want to remove the task from the list?");
    if (rusure) {
      if (item.id == undefined) return;
      $scope.todosList.$remove(item);
    }
  };

  $scope.edit = function(item) {
    var changes = prompt("Please make the changes below", item.text);
    if (changes != null) {
      if (item.id == undefined) return;
      item.text = changes;
      $scope.todosList.$save(item);
    }
  };

  $scope.priority = function(item) {
    if (item.id == undefined) return;
    item.priority = 1 - item.priority;
    $scope.todosList.$save(item);
  };

  // Update the "completed" status
  $scope.checkboxClick = function(item) {
    if (item.id == undefined) return;
    item.doneDev = item.doneDev;
    item.doneProd = item.doneProd;
    $scope.todosList.$save(item);
  }

  $scope.todosList.$loaded().then(function() {
    $('.splash, #main').fadeToggle();
  });

}