'use strict';

angular.module('rt.filters', [])
    .filter('hightLightCountry', function () {
        return function (countries, searchNeedle, afterFilterCountryArray) {
            //console.log('start to filter, the countries are:');
            //console.log(countries);
            //console.log("searchNeedle:"+searchNeedle+"<");

            if(afterFilterCountryArray.length > 0){
                var result_array = [];
                for (var i = 0; i < countries.length; i++) {
                    var country = countries[i];

                    if( -1 !== afterFilterCountryArray.indexOf(country.englishSeoName) ){
                        result_array.push(country);
                    }
                }

                return result_array;
            }
            
            var searchMatch = new RegExp(searchNeedle, 'i');
            for (var i = 0; i < countries.length; i++) {
                var country = countries[i];
                console.log('target is:'+String.prototype.trim(searchNeedle));
                if( !angular.isString(searchNeedle) || 
                    '' == searchNeedle.trim(searchNeedle) ){
                    country.searchMatched = false;  
                }
                else if (searchMatch.test(country.name)) {
                    country.searchMatched = true;
                }
                else{
                    country.searchMatched = false;  
                } 
            
            }
            return countries;
        };

    }).filter('filterAirport', ['Functions',function (Functions) {
        return function (airports, searchNeedle, selectedCountry, afterFilterAirportArray) {
            //console.log('start to filter, the airports are:');
            //console.log(airports);
            //console.log("searchNeedle:"+searchNeedle+"<");
            var result_array = [];
            var newRangeAirportArray = [];
            
            var searchMatch = new RegExp(searchNeedle, 'i');

            if(afterFilterAirportArray.length >0){
                for (var i = 0; i < airports.length; i++) {
                    var airport = airports[i];
                    
                    if ( -1 !== afterFilterAirportArray.indexOf( airport.iataCode) ){
                        result_array.push(airport);
                    }
                }
                newRangeAirportArray = result_array;
            }
            else{
                newRangeAirportArray = airports;
            }

            if(!Functions.isEmpty(selectedCountry)){
                result_array = [];

                for (var i = 0; i < newRangeAirportArray.length; i++) {
                    var airport = newRangeAirportArray[i];
                    
                    if (selectedCountry.englishSeoName == airport.country.englishSeoName) {
                        result_array.push(airport);
                    }
                }
            }
            else
            {
                result_array = [];
                for (var i = 0; i < newRangeAirportArray.length; i++) {
                    var airport = newRangeAirportArray[i];
                    console.log('target is:'+String.prototype.trim(searchNeedle));
                    
                    if (searchMatch.test(airport.name)) {
                        result_array.push(airport);
                    }
                    else if(searchMatch.test(airport.country.name)){
                        result_array.push(airport);
                    }
                
                }

            }
            return result_array;
        };

    }]);







