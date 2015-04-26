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
	}]).factory('Country', ['$q', function($q){
        function Country(countryData){
            if( countryData && 
                !Functions.isEmpty(countryData)){
                this.setData(countryData);
            }
        };

        Country.prototype = {
            setData: function(countryData){
                angular.extend(this, countryData);
            }
        };
        return Country;
    }])
    .factory('CountriesManager',['$q', 'Functions', 'CountryService',
    	function($q, Functions, CountryService){
        var countriesManager = {
            _countries: [],

            getCountries: function (){
                var deferred = $q.defer();

                if(Functions.isEmpty(this._countries)){
                    
                    this.updateCountries().then(function(data){
                    	console.log('inside service before resolve...');
                    	console.log(data);
                        //deferred.resolve(data);
                        deferred.resolve(Functions.deepClone(data.data));
                    },function(err){
                        deferred.reject(err);
                    });
                }
                else{
                    deferred.resolve(this._countries);
                }

                return deferred.promise;
            },

            setCountries: function (countries){
                this._countries = countries;
            },

            updateCountries: function (){
                var deferred = $q.defer();
                var manager = this;
                    
                CountryService.getAllCountriesWithProxy().then(function(data){
                	console.log('inside updateCountries:');
                	console.log(data);
                    manager.setCountries(data);

                    deferred.resolve({hasError:false,msg:'',data:data});
                },function(err){
                    deferred.reject({hasError:false,msg:'',data:err});

                });

                return deferred.promise;
            },

            reset : function(){
                this._countries = [];
            }
        };
        return countriesManager;
    }]);;