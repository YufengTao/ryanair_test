'use strict';

angular.module('rt.services')
	.factory('RoutesService',[ '$q', 'RoutesResource',
		function($q, RoutesResource){

		var getAllRoutesWithProxy = function(){

			var deferred = $q.defer();

			RoutesResource.get_with_proxy().get(
				{},
				function(data){
					//success handler
					console.log('the data inside the resource:');
					console.log(data);
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
	}]).factory('Route', ['$q', function($q){
        function Route(routeDate){
            if( routeDate && 
                !Functions.isEmpty(routeDate)){
                this.setData(routeDate);
            }
        };

        Route.prototype = {
            setData: function(routeDate){
                angular.extend(this, routeDate);
            }
        };
        return Route;
    }])
    .factory('RoutesManager',['$q', 'Functions', 'RoutesService',
    	function($q, Functions, RoutesService){
        var routesManager = {
            _routes: [],

            getRoutes: function (){
                var deferred = $q.defer();

                if(Functions.isEmpty(this._routes)){
                    
                    this.updateRoutes().then(function(data){
                    	console.log('before return:');
                    	console.log(data);
                    	
                        deferred.resolve(Functions.deepClone(data));
                    },function(err){
                        deferred.reject(err);
                    });
                }
                else{
                    deferred.resolve(this._routes);
                }

                return deferred.promise;
            },

            setRoutes: function (routes){
                this._routes = routes;
            },

            updateRoutes: function (){
                var deferred = $q.defer();
                var manager = this;
                    
                RoutesService.getAllRoutesWithProxy().then(function(data){
                	console.log('before setting the data');
                	console.log(data);

                    manager.setRoutes(data.data);

                    deferred.resolve({hasError:false,msg:'',data:data});
                },function(err){
                    deferred.reject({hasError:false,msg:'',data:err});

                });

                return deferred.promise;
            },

            reset : function(){
                this._routes = [];
            }
        };
        return routesManager;
    }]);;