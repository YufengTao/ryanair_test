'use strict';

angular.module('rt.config', []).config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        //for invalid routes
        $urlRouterProvider.otherwise("/");

        //this step is allocating the different stateObject to the corresponding state route
        //the "states" array is defined in the states.js file
        angular.forEach(states, function (r) {
            $stateProvider.state(r.stateName, r.stateObj);
        });
        $locationProvider.html5Mode(true);

        $httpProvider.defaults.useXDomain = true;

        //solving the IE ajax request cache issue
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};    
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers']   = '';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin']    = '*';
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        

        // HTTP Interceptor
        $httpProvider.interceptors.push(['$q', '$rootScope', '$config', function ($q, $rootScope, $config) {
            return {
                // On request success
                request: function (config) {
                    //console.log("Test", config);
                    // Dont authenticate for partials or Angular bootstrap#
                    /*console.log(config);

                    var base_url = '';
                    var exclude = /^(\/partials|template|\/crypt|\/modals|\/forms)/;
                    var sendToNode = /^(\/bet\?)/;
                    var connectWithRealServer = /^(\/user.*|\/subscriptions*|\/bets*|\/lotteries*|\/add_card*|\/lead.*|\/.*\/pin|\/wallet|\/lines\/.*|\/notification.*|\/prize|\/affiliate.*)/;

                    if (!exclude.test(config.url)) {
                        
                        if($config.http.testing){

                            if ($config.http.testing && ! sendToNode.test(config.url)) {
                                //the line below is used to send the request to the apiary-mock server
                                //base_url = $config.http.servers.test ;

                                console.log('set the base_url as the same as the desired one');
                                
                                console.log('The url on the fly is:'+config.url);
                            }

                            //test if the uri is contained in the request path
                            //if does then send to the real server
                            //if not then send to the mock server
                            if( true == $config.http.ciTest && 
                                connectWithRealServer.test(config.url)){
                                base_url = $config.http.servers.local_node;
                                console.log('The url with the real server is:'+config.url);
                            }

                            //update the url on the fly
                            config.url = base_url + config.url;

                            if (localStorage.getItem('nb:auth_token')) {
                                var authToken = localStorage.getItem('nb:auth_token');
                                //config['headers'] = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken};
                            }
                        }
                        else{
                            //update the url on the fly
                            config.url  = $config.http.servers.real_server_rel + config.url;
                        }
                    }*/

                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);
                },

                // On request failure
                requestError: function (rejection) {
                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response success
                response: function (response) {
                    console.log('Resoponse in the interceptor is:');

                    if( 'string' == typeof response.data && 
                        response.data.trim() == ''){
                        //for some 200 response there is nothing in the response and the higher layer can't get the response status
                        response.data = {};
                    }

                    response.data.status = response.status;
                    console.log(response);
                    // Return the response or promise.
                    return response || $q.when(response);
                },

                // On response failture
                responseError: function (rejection) {
                    console.log('On responseError :');
                    console.log(rejection);

                    //add custom error message
                    switch(rejection.status){
                        case 401:
                            console.log('receive 401 error message in http interceptor:');
                            rejection.data  = {};
                            rejection.data.message = 'need authorized';
                            break;
                    }

                    console.log(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        }]);

    }]);


// Create some global config options
angular.module('rt.config')
    .value('$config', {
        latency: 0
    });
