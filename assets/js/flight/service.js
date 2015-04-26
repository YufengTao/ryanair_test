'use strict';

angular.module('rt.services')
	.factory('FlightService',[ '$q', 'FlightResource',
		function($q, FlightResource){

		var getCheapFlightSingleLineWithProxy = function(searchObj){

			var deferred = $q.defer();

			FlightResource.get_with_proxy().get(
				{
					from : searchObj.from,
					to : searchObj.to,
					start_date : searchObj.start_date,
					end_date : searchObj.end_date,
					max_price : searchObj.max_price
				},
				function(data){
					//success handler
					deferred.resolve(data);

				},function(err){
					//error handler
					console.log('handle error msg when FlightResource.query() failed:');
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
			getCheapFlightSingleLineWithProxy: 	getCheapFlightSingleLineWithProxy	
		}
	}]);