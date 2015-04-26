'use strict';

angular.module('rt.services',[])
	.factory('AirportService',[ '$q', 'AirportResource', 'Functions',
		function($q, AirportResource, Functions){

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
	}])
	.factory('Airport', ['$q', function($q){
        function Airport(airportDate){
            if( airportDate && 
                !Functions.isEmpty(airportDate)){
                this.setData(airportDate);
            }
        };

        Airport.prototype = {
            setData: function(airportDate){
                angular.extend(this, airportDate);
            }
        };
        return Airport;
    }])
    .factory('AirportsManager',['$q', 'Functions', 'AirportService',
    	function($q, Functions, AirportService){
        var airportsManager = {
            _airports: [],

            getAirports: function (){
                var deferred = $q.defer();

                if(Functions.isEmpty(this._airports)){
                    
                    this.updateAirports().then(function(data){
                        deferred.resolve(Functions.deepClone(data));
                    },function(err){
                        deferred.reject(err);
                    });
                }
                else{
                    deferred.resolve(this._airports);
                }

                return deferred.promise;
            },

            setAirports: function (airports){
                this._airports = airports;
            },

            updateAirports: function (){
                var deferred = $q.defer();
                var manager = this;
                    
                AirportService.getAllAirportsWithProxy().then(function(data){
                    manager.setAirports(data.data);

                    deferred.resolve({hasError:false,msg:'',data:data});
                },function(err){
                    deferred.reject({hasError:false,msg:'',data:err});

                });

                return deferred.promise;
            },

            reset : function(){
                this._airports = [];
            }
        };
        return airportsManager;
    }]);