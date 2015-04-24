'use strict';

angular.module('rt.controllers', [])
	.controller('FlightSearchController', ['$scope', '$rootScope', '$state', 'CountryService','AirportService','RoutesService',
		function($scope, $rootScope, $state, CountryService, AirportService, RoutesService){

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

				AirportService.getAllAirportsWithProxy().then(function(data){
					var airports = data;
					console.log(airports);
					console.log(airports[0].name);
				},function(){

				});

				RoutesService.getAllRoutesWithProxy().then(function(data){
					var routes = data;
					console.log(routes);
					console.log(routes[0].name);
				},function(){

				});

				
				
			};
		}]);