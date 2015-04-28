'use strict';

angular.module('rt.controllers', [])
	.controller('FlightSearchController', ['$scope', '$rootScope', '$state', 'CountryService','AirportService','RoutesService', 'AirportsManager', 'CountriesManager', 'FlightService', 'RoutesManager', 'Functions', '$timeout',
		function($scope, $rootScope, $state, CountryService, AirportService, RoutesService,AirportsManager, CountriesManager, FlightService, RoutesManager, Functions, $timeout){

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

				selectedDepFlight 	:{},
				selectedReturnFlight:{}
			};

			$scope.allAirports 		= [];
			$scope.allCountries;
			$scope.allRoutes 		= [];
			$scope.desRoutes 		= [];

			$scope.displayFromPanel 	= false;
			$scope.displayToPanel 		= false;
			$scope.displayMap 			= false;

			$scope.searchedDepResult 	= null;
			$scope.searchedReturnResult = null;

			$scope.depResultOrderReverse= false;
			$scope.returnResultOrderReverse= false;

			$scope.displayResults 		= false;

			$scope.calendarOpened 		= false;
			
			$scope.message 				= '';
			$scope.messageType 			= '';

			$scope.roundTrip 			= true;

			$scope.pageContents 	= {
				originInputPlaceHolder 	: 'Origin airport',
				desInputPlaceHolder 	: 'Destination airport',
				depDateInputPlaceHolder 	: 'Departure Date',
				returnDateInputPlaceHolder 	: 'Return Date',
				maxPriceInputPlaceHolder: 'Max Price',
				searchButtonText 		: 'Search'
			};

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

			$scope.getReadableDateStr = function(date){
				return Functions.getReadableDateStrFromDate(date);
			};

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

				var delay = 0;
				if($scope.displayToPanel === true){
					delay = 1000;
				}
				$timeout(function(){
					$scope.displayFromPanel = true;
				},delay);
				
				$scope.displayToPanel 	= false;
				
			}

			$scope.hideFromPanel = function(){
				$scope.displayFromPanel = false;
			}

			$scope.showToPanel = function(){
				var delay = 0;
				if($scope.displayFromPanel === true){
					delay = 1000;
				}

				$timeout(function(){
					$scope.displayToPanel = true;
				},delay);
				
				$scope.displayFromPanel = false;
				
			}

			$scope.hideToPanel = function(){
				$scope.displayToPanel = false;
			};

			$scope.onSelectOriginAirport = function(){
				console.log('onSelectOriginAirport is fired');
				$scope.displayFromPanel = false;
			};

			$scope.onSelectReturnAirport = function(){
				$scope.displayToPanel = false;
			};

			$scope.onFromPanelBlur = function(){
				$scope.displayFromPanel = false;
			};

			$scope.onToPanelBlur = function(){
				$scope.displayToPanel = false;
			};

			$scope.priceOrder = function(flight){
				return parseInt(flight.outbound.price.value);
			}

			$scope.search = function(){
				console.log('start to search...');
				//$scope.displayFromPanel = !$scope.displayFromPanel;

				//reset
				$scope.message = '';
				$scope.messageType = '';

				//check parameters
				if($scope.targetRouteInfo.cityFrom.iataCode == 'undefined' ||
					$scope.targetRouteInfo.cityFrom.name == ''){
					$scope.messageType 	= 'error';
					$scope.message 		= 'Please select or enter a depart airport';
				}
				else if($scope.targetRouteInfo.cityTo.iataCode == 'undefined'||
					$scope.targetRouteInfo.cityTo.name == ''){
					$scope.messageType 	= 'error';
					$scope.message 		= 'Please select or enter a destination airport';
				}
				else if($scope.targetRouteInfo.searchStartDate == ''){
					$scope.messageType 	= 'error';
					$scope.message 		= 'Please select depart date';
				}
				else if( $scope.roundTrip === true &&
						 $scope.targetRouteInfo.searchEndDate == ''){
					$scope.messageType 	= 'error';
					$scope.message 		= 'Please select return date';
				}
				else if($scope.targetRouteInfo.maxPrice == ''){
					$scope.messageType 	= 'error';
					$scope.message 		= 'Please enter a max price';
				}

				if($scope.messageType =='error'){

					$timeout(function() {
						$scope.messageType  = '';
						$scope.message 		= '';
					}, 5000);

					return;
				}
				
				var searchOptions = {
					from 	: $scope.targetRouteInfo.cityFrom.iataCode,
					to 		: $scope.targetRouteInfo.cityTo.iataCode,
					start_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchEndDate),
					end_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchEndDate),
					max_price: $scope.targetRouteInfo.maxPrice
				}
				
				FlightService.getCheapFlightSingleLineWithProxy(searchOptions).then(function(data){
					console.log('the cheap flight info is:');
					console.log(data);

					//update the data with test dummy data

					if(data.flights.length > 0){

						//add flight id
						for(var flightIndex in data.flights){
							var flightObj = data.flights[flightIndex].outbound;
							flightObj.flightId = Functions.getRandomChar()+Functions.getRandomChar()+Functions.getRandomChar()+Functions.getRandomSingleInteger()+Functions.getRandomSingleInteger()+Functions.getRandomSingleInteger()+Functions.getRandomSingleInteger();

							var fromDateObj  = new Date(flightObj.dateFrom);
							fromDateObj.setHours(Math.random() * 24);
							fromDateObj.setMinutes(Math.random() * 60);

							var toDateObj  = new Date(flightObj.dateTo);
							toDateObj.setHours(Math.random() * 24);
							toDateObj.setMinutes(Math.random() * 60);
							
							flightObj.dateFrom = Functions.getServerStdUTCTimeStr(fromDateObj);
							flightObj.dateTo = Functions.getServerStdUTCTimeStr(toDateObj);
						}
					}

					//===========================

					$scope.searchedDepResult = data;
				}, function(){

				});

				var searchReturnOptions = {
					from 	: $scope.targetRouteInfo.cityTo.iataCode,
					to 		: $scope.targetRouteInfo.cityFrom.iataCode,
					start_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchStartDate),
					end_date : Functions.getSearchStdDateStr($scope.targetRouteInfo.searchStartDate),
					max_price: $scope.targetRouteInfo.maxPrice
				}

				if($scope.roundTrip === true){

					FlightService.getCheapFlightSingleLineWithProxy(searchReturnOptions).then(function(data){
						console.log('the cheap flight info is:');
						console.log(data);

						$scope.searchedReturnResult = data;
					}, function(){

					});
				
				}
				
			};

			$scope.selectDepFlight =function(flight){
				console.log('setting the dep flight');
				$scope.targetRouteInfo.selectedDepFlight = flight;
			}

			$scope.selectReturnFlight =function(flight){
				$scope.targetRouteInfo.selectedReturnFlight = flight;
			}
			

			$scope.autoSelectDepAirport = function(){
				console.log('start auto select');

				if(''==$scope.targetRouteInfo.cityFrom.name){
					$scope.targetRouteInfo.cityFrom = {
						name : '',

					};
					return;
				}



				var searchMatch = new RegExp($scope.targetRouteInfo.cityFrom.name, 'i');
				for(var apIndex=0;apIndex<$scope.allAirports.length;apIndex++){
					var airport = $scope.allAirports[apIndex];
					if(searchMatch.test(airport.name)){
						$scope.targetRouteInfo.cityFrom = Functions.deepClone(airport);
						break;
					}
				}
			}

			$scope.autoSelectReturnAirport = function(){
				console.log('start auto select autoSelectReturnAirport');

				if(''==$scope.targetRouteInfo.cityTo.name){
					$scope.targetRouteInfo.cityTo = {
						name : '',
						
					};
					return;
				}



				var searchMatch = new RegExp($scope.targetRouteInfo.cityTo.name, 'i');
				for(var apIndex=0;apIndex<$scope.allAirports.length;apIndex++){
					var airport = $scope.allAirports[apIndex];
					console.log('test the '+apIndex+"th airport:");
					console.log(airport);
					
					if(searchMatch.test(airport.name)){
						$scope.targetRouteInfo.cityTo = Functions.deepClone(airport);
						break;
					}
				}
			}

			//

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
                console.log($scope.allCountries);
			}, function(data){

			});

			//TEST PART
			//$scope.searchedDepResult = JSON.parse('{"flights":[{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"1965.88","valueMainUnit":"1965","valueFractionalUnit":"88","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"152.46","valueMainUnit":"152","valueFractionalUnit":"46","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"1998.42","valueMainUnit":"1998","valueFractionalUnit":"42","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"1044.83","valueMainUnit":"1044","valueFractionalUnit":"83","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"184.02","valueMainUnit":"184","valueFractionalUnit":"02","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"907.00","valueMainUnit":"907","valueFractionalUnit":"00","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"1341.11","valueMainUnit":"1341","valueFractionalUnit":"11","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}},{"outbound":{"airportFrom":{"iataCode":"PDV","name":"Plovdiv","base":false,"latitude":42.0678,"longitude":24.8508,"country":{"code":"bg","name":"Bulgaria","seoName":"bulgaria","englishSeoName":"bulgaria","currency":"EUR","url":"bulgaria"}},"airportTo":{"iataCode":"HHN","name":"Frankfurt Hahn","base":true,"latitude":49.9487,"longitude":7.26389,"country":{"code":"de","name":"Germany","seoName":"germany","englishSeoName":"germany","currency":"EUR","url":"germany"}},"price":{"value":"81.28","valueMainUnit":"81","valueFractionalUnit":"28","currencySymbol":"€"},"dateFrom":"2015-04-26T00:00:00+00:00","dateTo":"2015-04-26T00:00:00+00:00"}}],"count":8,"totalCount":8,"currency":{"symbol":"€","maxPrice":"2000","defaultPrice":0},"currencySymbol":"€","request":{"from":"PDV","to":"HHN","start_date":"2015-04-26","end_date":"2015-04-26","max_price":"2000"}}');
			//console.log('$scope.searchedDepResult is:');
			//console.log($scope.searchedDepResult);

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