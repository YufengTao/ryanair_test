'use strict';

angular.module('rt.resources', [])
    .factory('AirportResource', ['$resource','$http', function ($resource, $http) {

        var get_with_jsonp = function(){
            return $http.jsonp('http://ryanair-test.herokuapp.com/api/countries?callback=JSON_CALLBACK');
        }

        var get_with_proxy = function(){
            return $resource('/airports/:action', {action:"@action"},{});
        }

        return {
            get_with_jsonp: get_with_jsonp,
            get_with_proxy: get_with_proxy
        }
    }]);
