'use strict';

angular.module('rt.resources')
    .factory('FlightResource', ['$resource','$http', function ($resource, $http) {

        var get_with_proxy = function(){
            return $resource('/cheap-flights/:from/:to/:start_date/:end_date/:max_price', {
                from:"@from",
                to:"@to",
                start_date:"@start_date",
                end_date:"@end_date",
                max_price:"@max_price",
            },{});
        }

        return {
            get_with_proxy: get_with_proxy
        }
    }]);
