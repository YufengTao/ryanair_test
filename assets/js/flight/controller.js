'use strict';

angular.module('rt.controllers', [])
	.controller('FlightSearchController', ['$scope', '$rootScope', '$state', 'CountryService','AirportService','RoutesService', 'AirportsManager', 'CountriesManager', 'FlightService', 'RoutesManager', 'Functions',
		function($scope, $rootScope, $state, CountryService, AirportService, RoutesService,AirportsManager, CountriesManager, FlightService, RoutesManager, Functions){

			$scope.targetRouteInfo = {
				cityFrom 	: {
					name: ''
				},
				cityTo 		: {
					name: ''
				},
				searchStartDate 	: '',
				searchEndDate 		: '',
				maxPrice 			: '',
			};

			$scope.allAirports 		= [];
			$scope.allCountries 	= [];
			$scope.allRoutes 		= [];
			$scope.desRoutes 		= [];

			$scope.displayFromPanel 	= false;
			$scope.displayToPanel 		= false;
			$scope.displayMap 			= false;

			$scope.displayResults 		= false;

			$scope.calendarOpened = false;

			$scope.formats = [ 'd MMM yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  			$scope.format = $scope.formats[0];

  			$scope.dateOptions = {
			    formatYear: 'yy',
			    startingDay: 1
			};

			$scope.currentDate = new Date();
			$scope.departureCalStartDate 	= $scope.currentDate;
			$scope.departureCalEndDate 		= $scope.currentDate;
			$scope.returnCalStartDate 		= $scope.currentDate;


  			$scope.openCalendar = function($event) {
			    $event.preventDefault();
			    $event.stopPropagation();

			    $scope.calendarOpened = !$scope.calendarOpened;
			};

			$scope.onChangeStartDate = function(newDate){
				console.log('on change fired on controller...');
				//$scope.returnCalStartDate = newDate;
				if( $scope.targetRouteInfo.searchEndDate < newDate){
					$scope.targetRouteInfo.searchEndDate = new Date(newDate.getTime());
				}
			};

			$scope.onChangeReturnDate = function(newDate){
				console.log('the return date changed:');
				console.log(newDate);
				console.log('current departure date:');
				console.log($scope.targetRouteInfo.searchStartDate);
			
				if( $scope.targetRouteInfo.searchStartDate > newDate){
					console.log('udpate the searchStartDate:');
					console.log(new Date(newDate.getTime()));
					$scope.targetRouteInfo.searchStartDate = new Date(newDate.getTime());
				}
			};

			$scope.showFromPanel = function(){
				$scope.displayFromPanel = true;
			}

			$scope.hideFromPanel = function(){
				$scope.displayFromPanel = false;
			}

			$scope.showToPanel = function(){
				$scope.displayToPanel = true;
			}

			$scope.hideToPanel = function(){
				$scope.displayToPanel = false;
			}

			$scope.search = function(){
				console.log('start to search...');
				//$scope.displayFromPanel = !$scope.displayFromPanel;
				
				var searchOptions = {
					from 	: $scope.targetRouteInfo.cityFrom.iataCode,
					to 		: $scope.targetRouteInfo.cityTo.iataCode,
					start_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchStartDate),
					end_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchStartDate),
					max_price: $scope.targetRouteInfo.maxPrice
				}
				
				FlightService.getCheapFlightSingleLineWithProxy(searchOptions).then(function(data){
					console.log('the cheap flight info is:');
					console.log(data);
				}, function(){

				});
				
				
			};

			AirportsManager.getAirports().then(function(data){

				$scope.allAirports = data.data;

				console.log('airports instance has been initialized');
                console.log(data);
			}, function(data){

			});

			CountriesManager.getCountries().then(function(data){
				console.log('allCountries inside controller before assigning...');
				console.log(data);
				$scope.allCountries = data;

				console.log('Country instance has been initialized');
                console.log(data);
			}, function(data){

			});


			RoutesManager.getRoutes().then(function(data){

				delete data.data.$resolved;
				$scope.allRoutes = data.data;

				console.log('Routes instance has been initialized');
                console.log(data);

                //the received array is about: departure => [des airport]
                //need reverse back and cache it: [departure] => des
                for (var fromAirportCode in data.data){

                	for(var index in data.data[fromAirportCode]){
                		var desAirportCodeArray = data.data[fromAirportCode];
                		if(!$scope.desRoutes.hasOwnProperty(desAirportCodeArray[index])){
	                		$scope.desRoutes[desAirportCodeArray[index]] = [];
	                	}

	                	if(-1 === ($scope.desRoutes[desAirportCodeArray[index]]).indexOf(fromAirportCode)){
		                	$scope.desRoutes[desAirportCodeArray[index]].push(fromAirportCode);
	                	}


                	}
                	
                }

                console.log('the $scope.desRoutes is:');
                console.log($scope.desRoutes);

			}, function(data){

			});
		}]);