'use strict';

angular.module('rt.services')
	.factory('RoutesService',[ '$q', 'RoutesResource',
		function($q, RoutesResource){

		var getAllRoutesWithProxy = function(){

			var deferred = $q.defer();

			RoutesResource.get_with_proxy().query(
				{},
				function(data){
					//success handler
					deferred.resolve(data);

				},function(err){
					//error handler
					console.log('handle error msg when RoutesResource.query() failed:');
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
			getAllRoutesWithProxy: 	getAllRoutesWithProxy	
		}
	}]);