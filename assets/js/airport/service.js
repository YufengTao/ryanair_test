'use strict';

angular.module('rt.services',[])
	.factory('AirportService',[ '$q', 'AirportResource',
		function($q, AirportResource){

		var getAllAirportsWithProxy = function(){

			var deferred = $q.defer();

			AirportResource.get_with_proxy().query(
				{},
				function(data){
					//success handler
					deferred.resolve(data);

				},function(err){
					//error handler
					console.log('handle error msg when AirportResource.query() failed:');
					console.log(err);

					deferred.reject({
						hasError: true,
						msg:err.data,
						responseStatus:err.status
					});
			});
			return deferred.promise;
		};

		return{
			getAllAirportsWithProxy: 	getAllAirportsWithProxy	
		}
	}]);