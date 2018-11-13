(function (angular) {
    'use strict';

    //// JavaScript Code ////


    //// Angular Code ////
    angular.module('codeine').constant('Constants', {
        CODEINE_NODES_PROJECT_NAME : 'Codeine_Internal_Nodes_Project',
        CODEINE_WEB_SERVER : (location.port === '9000' && location.hostname === '127.0.0.1')  ? 'http://icsl2356.iil.intel.com:12377' : '',
        CODEINE_API_PREFIX : (location.port === '9000' && location.hostname === '127.0.0.1')  ? '/api-with-token' : '/api',
        //CODEINE_WEB_SERVER : location.hostname.indexOf('127.0.0.1') === -1  ? '' : 'http://localhost:12347',
        EVENTS : {
            TAGS_CHANGED : 'tagsChanged',
            BREADCRUMB_CLICKED : 'breadcrumbClicked'
        }
    });

})(angular);
