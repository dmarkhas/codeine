'use strict';
angular.module('codeine').directive('codeineLogin', ['$log','$modal',function ($log, $modal) {
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, element) {

            $scope.click = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/components/directives/user_info/login.html',
                    scope: $scope,
                    controller: loginCtrl
                });

                modalInstance.result.then(function () {
                }, function () {
                });
            }

            element.bind('click', $scope.click)
        }
    };
}]);

var loginCtrl = function($scope, $log, CodeineService ,$window) {
    $scope.data = {};
    $scope.errors = [];

    $scope.removeAlert = function(alert,index) {
        $scope.errors.splice(index, 1);
    };

    $scope.signin = function() {
        if (loginForm.$invalid) return;
        $log.debug('loginCtrl: signin');
        CodeineService.login($scope.data.username, $scope.data.password).success(function() {
            $log.debug('loginCtrl: signin success');
            $scope.$close();
            $window.location.reload();
        }).error(function(data,statusg) {
            if (status === 404) {
                $scope.errors.push({ msg : 'Could not reach server', id : new Date(), close :  $scope.removeAlert });
            } else {
                $scope.errors.push({ msg: 'Wrong username or password, please try again', id: new Date() ,close: $scope.removeAlert });
            }
        });
    };

    $scope.register = function() {
        if (loginForm.$invalid) return;
        $log.debug('loginCtrl: register');
        CodeineService.register($scope.data.username, $scope.data.password).success(function() {
            $log.debug('loginCtrl: register success');
            $scope.signin();
        }).error(function(data,status) {
                if (status === 409) {
                    $scope.errors.push({ msg : 'User already exists, please select a different username', id : new Date(), close: $scope.removeAlert  });
                } else {
                    $scope.errors.push({ msg: 'Error registrating user', id: new Date() , close: $scope.removeAlert  });
                }
            });
    }

    $scope.cancel = function() {
        $scope.$dismiss();
    }

}