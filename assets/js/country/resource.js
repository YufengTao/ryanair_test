'use strict';

angular.module('rt.resources', [])
    .factory('CountryResource', ['$resource','$http', function ($resource, $http) {
        var get = function(){ 
                return $http({
                    method: 'GET',
                    url: 'http://ryanair-test.herokuapp.com/api/countries',
                    //url:'/country',
                    headers: {
                        'Content-Type':'Application/JSON'
                    },
                    withCredentials: true
                });
        }

        var get_with_jsonp = function(){
            return $http.jsonp('http://ryanair-test.herokuapp.com/api/countries?callback=JSON_CALLBACK');
        }

        var get_with_proxy = function(){
            return $resource('/countries/:action', {action:"@action"},{});
        }

        return {
            get: get,
            get_with_jsonp: get_with_jsonp,
            get_with_proxy: get_with_proxy
        }
    }]);
