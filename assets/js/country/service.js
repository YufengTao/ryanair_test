'use strict';

angular.module('rt.services')
	.factory('CountryService',[ '$q', 'CountryResource',
		function($q, CountryResource){

		var getAllCountriesWithProxy = function(){

			var deferred = $q.defer();

			CountryResource.get_with_proxy().query(
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

		var getAllCountriesWithJSONP = function(){

			var deferred = $q.defer();

			CountryResource.get_with_jsonp().then(
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
			getAllCountriesWithProxy: 	getAllCountriesWithProxy	,
			getAllCountriesWithHttp: 	getAllCountriesWithHttp,
			getAllCountriesWithJSONP:   getAllCountriesWithJSONP	
		}
	}]);