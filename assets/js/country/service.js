'use strict';

angular.module('rt.services',[])
	.factory('CountryService',[ '$q', 'CountryResource',
		function($q, CountryResource){

		var getAllCountries = function(){

			var deferred = $q.defer();

			CountryResource.query(
				{},
				function(data){
					//success handler
					deferred.resolve(data);

				},function(err){
					//error handler
					console.log('handle error msg when CountryResource.query() failed:');
					console.log(err);

					deferred.reject({
						hasError: true,
						msg:err.data,
						responseStatus:err.status
					});
			});
			return deferred.promise;
		};

		var getAllCountriesWithHttp = function(){

			var deferred = $q.defer();

			CountryResource.get().then(
				function(data){
					//success handler
					deferred.resolve(data.data);

				},function(err){
					//error handler
					console.log('handle error msg when CountryResource.query() failed:');
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
			getAllCountries: 			getAllCountries	,
			getAllCountriesWithHttp: 	getAllCountriesWithHttp	
		}
	}]);