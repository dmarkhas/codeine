(function (angular) {
    'use strict';

    //// JavaScript Code ////
    function nodeFilter() {

        var showByName = function(query,node_name) {
            if (!query) {
                return true;
            }
            return node_name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        };

        var showByCollectors = function(selectedMonitor,collectors) {
            if (selectedMonitor === 'All Nodes') {
                return true;
            }

            if (selectedMonitor === 'Any Alert') {
                return collectors.length > 0;
            }

            return collectors.indexOf(selectedMonitor) !== -1;
        };

        var showByTags = function(tags, nodeTags, tagsMode) {
            var mode = tagsMode || '||';
            var noTagsSelected = true;
            for (var i=0; i < tags.length ; i++) {
                if (!tags[i].state) {
                    continue;
                }
                noTagsSelected = false;
                if (tags[i].state === 1) {
                    if (nodeTags.indexOf(tags[i].immutable.name) !== -1) {
                        if (mode === '||') {
                            return true;
                        }
                        noTagsSelected = true;
                    }
                    else if (mode === '&&') {
                        return false;
                    }
                }
            }
            return noTagsSelected;
        };

        return function(node, query, monitor, tags, filterMode) {
            return (showByName(query, node.alias) &&
            (showByCollectors(monitor, node.failed_collectors)) &&
            showByTags(tags,node.tags, filterMode));
        };
    }


    //// Angular Code ////
    angular.module('codeine').filter('nodeFilter', nodeFilter);

})(angular);






