'use strict';

angular.module('rt.controllers', [])
	.controller('FlightSearchController', ['$scope', '$rootScope', '$state', 'CountryService',
		function($scope, $rootScope, $state, CountryService){

			$scope.targetRouteInfo = {
				cityFrom 	: '',
				cityTo 		: '',
				searchStartDate 	: '',
				searchEndDate 		: '',
				maxPrice 			: '',
			};

			$scope.search = function(){
				console.log('start to search...');

				
				CountryService.getAllCountries().then(function(data){
					var countries = data;
					console.log(countries);
					console.log(countries[0].name);
				},function(){

				});
				
			};
		}]);