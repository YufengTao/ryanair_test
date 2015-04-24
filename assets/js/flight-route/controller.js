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

			$scope.displayFromPanel 	= false;
			$scope.displayToPanel 		= false;
			$scope.displayMap 			= false;

			$scope.displayResults 		= false;

			$scope.search = function(){
				console.log('start to search...');
				$scope.displayFromPanel = !$scope.displayFromPanel;
				
				CountryService.getAllCountriesWithProxy().then(function(data){
					var countries = data;
					console.log(countries);
					console.log(countries[0].name);
				},function(){

				});
				
			};
		}]);