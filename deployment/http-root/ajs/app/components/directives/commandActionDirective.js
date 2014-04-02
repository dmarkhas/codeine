'use strict';
angular.module('codeine').directive('commandAction', ['$log', function ($log) {
    return {
        restrict: 'A',
        scope : {
            project : '=',
            permissions : '='
        },
        link: function ($scope, element) {
            if ($scope.permissions.command_project.indexOf($scope.project) === -1) {
                $log.debug('commandAction: User do not have command permissions, will hide element');
                element.hide();
            } else {
                $log.debug('commandAction: User has command permissions');
                element.show();
            }
        }
    };
}]);