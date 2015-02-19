(function (angular) {
    'use strict';

    //// JavaScript Code ////
    function projectConfigureCtrl($timeout, $route, $scope, $log,$routeParams, CodeineService, project,$location,AlertService, projects) {
        $scope.projectName = $routeParams.project_name;
        $scope.projectConfigurationForEditing = project.cloneConfiguration();
        $scope.tags = [];
        $scope.nodes = ['all'];
        $scope.project_is_open = true;
        var org =  project.nodes_aliases;
        if (project.nodes_aliases.length > 100) {
            org = project.nodes_aliases.slice(0,100);
            $log.info('More then 100 nodes, will not include all of them in the tabs');
        }
        $scope.nodes = $scope.nodes.concat(org);
        $scope.model = {
            commandAndMonitorAutoComplete : ['CODEINE_PROJECT_NAME','CODEINE_NODE_NAME','CODEINE_NODE_ALIAS','CODEINE_NODE_TAGS'],
            versionAutoComplete : ['CODEINE_PROJECT_NAME','CODEINE_NODE_NAME','CODEINE_NODE_ALIAS','CODEINE_NODE_TAGS','CODEINE_OUTPUT_FILE'],
            collectorAutoComplete : ['CODEINE_PROJECT_NAME','CODEINE_NODE_NAME','CODEINE_NODE_ALIAS','CODEINE_NODE_TAGS','CODEINE_OUTPUT_FILE'],
            nodesDiscoveryAutoComplete : ['CODEINE_PROJECT_NAME','CODEINE_OUTPUT_FILE'],
            tagsAutoComplete : ['CODEINE_PROJECT_NAME','CODEINE_NODE_NAME','CODEINE_NODE_ALIAS','CODEINE_OUTPUT_FILE']
        };

        function swapItems(index,array) {
            var temp = array[index];
            array[index] = array[index+1];
            array[index+1] = temp;
        }

        for (var i1=0; i1 < $scope.projectConfigurationForEditing.nodes_info.length ; i1++) {
            for (var j=0; j < $scope.projectConfigurationForEditing.nodes_info[i1].tags.length ; j++) {
                if ($scope.tags.indexOf($scope.projectConfigurationForEditing.nodes_info[i1].tags[j]) === -1) {
                    $scope.tags.push($scope.projectConfigurationForEditing.nodes_info[i1].tags[j]);
                }
            }
        }

        for (var i2=0; i2 < $scope.projectConfigurationForEditing.nodes_info.length ; i2++) {
            if ($scope.projectConfigurationForEditing.nodes_info[i2].tags.length === 0) {
                delete $scope.projectConfigurationForEditing.nodes_info[i2].tags;
            }
        }

        if ($scope.projectConfigurationForEditing.include_project_commands.length ===0) {
            delete $scope.projectConfigurationForEditing.include_project_commands;
        }

        for (var i3=0; i3 < $scope.projectConfigurationForEditing.permissions.length ; i3++) {
            if ($scope.projectConfigurationForEditing.permissions[i3].can_command.length === 0) {
                delete $scope.projectConfigurationForEditing.permissions[i3].can_command;
            }
        }

        $scope.addNode = function() {
            $scope.projectConfigurationForEditing.nodes_info.push({});
        };
        $scope.addEnvVar = function() {
            $scope.projectConfigurationForEditing.environment_variables.push({});
        };
        $scope.addUser = function() {
            $scope.projectConfigurationForEditing.permissions.push({can_read:true});
        };

        $scope.addMonitor = function() {
            $scope.projectConfigurationForEditing.monitors.push({is_open: true, name: "new_monitor_" + $scope.projectConfigurationForEditing.monitors.length, notification_enabled: true});
        };
        $scope.addCollector = function() {
            $scope.projectConfigurationForEditing.collectors.push({is_open: true, name: "new_collector_" + $scope.projectConfigurationForEditing.collectors.length, notification_enabled: true});
        };

        $scope.removeItem = function(array,index,$event) {
            $event.preventDefault();
            $event.stopPropagation();
            array.splice(index,1);
        };

        $scope.moveUp = function(array,index,$event) {
            $event.preventDefault();
            $event.stopPropagation();
            swapItems(index-1,array);
        };

        $scope.moveDown = function(array,index,$event) {
            $event.preventDefault();
            $event.stopPropagation();
            swapItems(index,array);
        };

        $scope.addCommand = function() {
            $scope.projectConfigurationForEditing.commands.push({is_open: true, name: "new_command_" + $scope.projectConfigurationForEditing.commands.length, parameters: [], concurrency : 1, command_strategy : 'Immediately', duration_units : 'Minutes', ratio : 'Linear', timeoutInMinutes: 10, prevent_override: true});
        };

        $scope.addParameter = function(command_info) {
            $scope.projectConfigurationForEditing.commands[$scope.projectConfigurationForEditing.commands.indexOf(command_info)].parameters.push({is_open: true, name: "NEW_PARAMETER", type : 'String'});
        };

        $scope.addNotification = function() {
            $scope.projectConfigurationForEditing.mail.push(  {intensity : 'Immediately'});
        };

        $scope.applyConfiguration = function(redirect) {
            $log.debug('applyConfiguration: ' + angular.toJson($scope.projectConfigurationForEditing));
            $scope.configPromise = CodeineService.saveProjectConfiguration($scope.projectConfigurationForEditing).success(function() {
                AlertService.addAlert('success','Project Configuration was saved successfully',3000);
                if (redirect) {
                    $location.path('/codeine/project/' + $scope.projectName + '/status');
                }
            });
        };

        $scope.reloadProject = function() {
            $log.debug('reloadProject: ' + angular.toJson($scope.projectConfigurationForEditing));
            $scope.configPromise = CodeineService.reloadProjectConfiguration($scope.projectConfigurationForEditing).success(function() {
                AlertService.addAlert('success','Project Configuration was reloaded from disk successfully',3000);
                $route.reload();
            });
        };

        $scope.select2Options = {
            'multiple': true,
            'simple_tags': true,
            'tags': $scope.tags,
            'tokenSeparators': [",", " "]
        };

        $scope.select2OptionsAllowedValues = {
            'multiple': true,
            'simple_tags': true,
            'tags': [],
            'tokenSeparators': [",", " "]
        };

        $scope.select2OptionsNodesValues = {
            'multiple': true,
            'simple_tags': true,
            'tags': $scope.nodes,
            'tokenSeparators': [",", " "]
        };
        $scope.projects  = [];

        angular.forEach(projects, function(key) {
            $scope.projects.push(key.name);
        });

        $scope.select2OptionsIncludeProjectCommands = {
            'multiple': true,
            'simple_tags': true,
            'tags': $scope.projects,
            'tokenSeparators': [",", " "]
        };

    }


    //// Angular Code ////
    angular.module('codeine').controller('projectConfigureCtrl', projectConfigureCtrl);

})(angular);