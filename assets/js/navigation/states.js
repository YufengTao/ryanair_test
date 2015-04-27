/*
 This file is shared across Node/Angular to allow HTML5 pushState create absolute URLs for Angular state.
 */
var states = [
    //default root page is 'index.html'
    {
        stateName: 'root',
        
        stateObj: {
            url: '/',
            views: {
                "topNavBar": {
                    templateUrl: "/partials/includes/top-nav-bar.html",
                },
                "main": {
                    templateUrl: "/partials/pages/home.html",
                },
                "banner@root":{
                    templateUrl: "/partials/includes/banner.html"
                },
                "body@root": {
                    templateUrl: "/partials/pages/flight/search.html",
                },
            },
            data: {
                
            },
            resolve:{

            }
        }
        
    }
    
];  