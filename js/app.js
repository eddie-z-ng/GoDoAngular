var godoApp = angular.module('godo', []);

godoApp.factory('godoStorage', function() {
  var STORAGE_ID = 'godo-angular';
  
  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID)) || [
        {
          task: "Walk the dog", 
          done: false 
        },
        {
          task: "Buy groceries", 
          done: false 
        },
        {
          task: "Call mom", 
          done: false 
        }
      ];
    },

    put: function(item) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(item));
    }
  };
});

godoApp.factory('godoFilterStorage', function() {
  var STORAGE_ID = 'godo-angular-selected';
  
  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID)) || {};
    },

    put: function(item) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(item));
    }
  };
});


godoApp.directive('onBlur', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('blur', function() {
        scope.$apply(attrs.onBlur);
      });}
  };
});

godoApp.directive('setFocus', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.setFocus, function(focusVal) {
        // The timeout lets the digest / DOM cycle run
        // before attempting to set focus
        focusVal && $timeout(function() {
                      element.focus();}, 0, false);
      });
    }
  };
});


function GodoController($scope, godoStorage, godoFilterStorage) {
  $scope.godos = godoStorage.get();
  $scope.category = godoFilterStorage.get();

  $scope.$watch('godos', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      godoStorage.put($scope.godos);
    }
  }, true);

  $scope.$watch('category', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      godoFilterStorage.put($scope.category);
    }
  }, true);


  $scope.addGodo = function() {
    $scope.godos.push({task: $scope.godoText, done: false});
    $scope.godoText = '';
  }

  $scope.togglecheckGodo = function(item) {
    item.done = item.done ? false: true; 
  }

  $scope.editGodo = function(item) {
    item.editing = true;
  }

  $scope.doneEditGodo = function(item) {
    item.editing = false;
    if (!item.task) {
      $scope.removeGodo(item);
    }
  }

  $scope.removeGodo = function(item) {
    $scope.godos.splice($scope.godos.indexOf(item), 1);
  }

  $scope.setCategory = function(done) {
    if (typeof(done) === 'undefined' || done === null) {
      delete $scope.category.done;
    }
    else {
      $scope.category.done = done;
    }
  }

  $scope.remaining = function(done) {
    if (typeof(done) === 'undefined' || done === null) {
      return $scope.godos.length;
    }
    else {
      var count = 0;
      angular.forEach($scope.godos, function(godo) {
        if (godo.done === done) {
          count++;
        }
      });
      return count;
    };
  }
}

