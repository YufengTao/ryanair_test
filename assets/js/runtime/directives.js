angular.module('rt.directives', [])
    .directive('rtDatePicker', ['$compile', 'Functions', function ($compile, Functions) {
        return {
            restrict: 'AE',
            replace: true,
            terminal: true,
            scope: { date: '=', mindate: '=', maxdate: '=', onDateChange: "&" },
            link: function (scope, element, attrs) {
                
                scope.calendarOpened = false;
                scope.dateDisplayStr = '';

                scope.formats = [ 'd MMM yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                scope.format = scope.formats[0];

                scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                console.log('the min date initialized is:');
                console.log(scope.mindate);

                scope.updateDateDisplayStr = function(date){
                    scope.dateDisplayStr = date.getDate() + ' ' + Functions.getMonthShortName(date.getMonth()) + ' ' + date.getFullYear();
                };

                scope.openCalendar = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    scope.calendarOpened = !scope.calendarOpened;
                };

                scope.onDateChanged = function(){
                    console.log('date changed fired inside directive');
                    scope.onDateChange({newDate:scope.date});
                    scope.updateDateDisplayStr(scope.date);
                };

                scope.updateDateDisplay = function(){
                    return date.getDate()+' '+date.getMonth();
                }

                scope.$watch('date',function(newValue, oldValue){
                    if(newValue !== oldValue){
                        scope.updateDateDisplayStr(scope.date);
                    }
                });

                //watching the changes to the minDate field
                /*attrs.$observe('date', function(){
                    console.log('the min date changed:');
                    console.log(attrs.mindate);
                    //scope.mindate = attrs.mindate;
                });*/


                var template =  '<div>'+
                                    '<input class="form-control" value="{{dateDisplayStr}}" ng-click="openCalendar($event)" />'+
                                    '<div type="text"  datepicker-popup="{{format}}" ng-model="date" is-open="calendarOpened" ng-click="openCalendar($event)" min-date="mindate" max-date="maxdate" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" close-text="Close" ng-change="onDateChanged()"></div>'+
                                '</div>';

                $compile(element.html(template).contents())(scope);
            }
        }
    }]).directive('airportPicker',['$compile', 'Functions',
        function($compile, Functions){
            return {
                restrict: 'AE',
                replace: true,
                terminal: true,
                scope: { countries: '=', search: '=', airports: '=', targetairport: '=', routes: '=', filteraparray : '=', filterairport : '=' },
                link: function (scope, element, attrs) {

                    scope.selectedCountry = {};
                    scope.afterFilterAirportArray = [];
                    scope.afterFilterCountryArray = [];

                    scope.selectCountry = function(country){
                        scope.selectedCountry = country;
                    };

                    scope.selectAirport = function(airport){
                        console.log('selected airport is:');
                        console.log(airport);
                        scope.targetairport = Functions.deepClone(airport);
                    };

                    scope.$watch('filterairport.iataCode',function(newValue, oldValue){
                        console.log('filterairport value changed:');
                        console.log(oldValue);
                        console.log(newValue);

                        if( typeof scope.filterairport == "object" &&
                            scope.filteraparray.hasOwnProperty(newValue) ){
                            scope.afterFilterAirportArray = scope.filteraparray[newValue];
                        }
                        else{
                            scope.afterFilterAirportArray = [];
                        }

                        console.log('after filter :');
                        console.log(scope.afterFilterAirportArray);
                        if(scope.afterFilterAirportArray.length > 0){

                            for(var airportIndex in scope.airports){
                                if( -1 !== scope.afterFilterAirportArray.indexOf(scope.airports[airportIndex].iataCode) ){
                                    scope.afterFilterCountryArray.push(scope.airports[airportIndex].country.englishSeoName);
                                }
                            }

                        }
                        console.log(scope.afterFilterCountryArray);
                    });

                    var template =  '<div>'+
                                        '<div>'+
                                            '<div ng-class="{\'test-hight-light\': country.searchMatched}" ng-repeat="country in countries | hightLightCountry : search : afterFilterCountryArray" ng-click="selectCountry(country)">{{country.name}}</div>'+
                                        '</div>' +
                                        '<div style="float:right;position:relative">'+
                                            '<div ng-repeat="airport in airports | filterAirport : search : selectedCountry : afterFilterAirportArray" ng-click="selectAirport(airport)">{{airport.name}}</div>'+
                                        '</div>'+
                                    '</div>';
                    

                    $compile(element.html(template).contents())(scope);
                }
            }
            
    }]);