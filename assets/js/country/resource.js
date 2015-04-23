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

        return $resource('/country/:action', {action:"@action"},{});
        //return $resource('http://ryanair-test.herokuapp.com/api/countries/:action', {action:"@action"},{});
    }]);
