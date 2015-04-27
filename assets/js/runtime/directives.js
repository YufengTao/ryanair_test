angular.module('rt.directives', [])
    .directive('rtDatePicker', ['$compile', 'Functions', function ($compile, Functions) {
        return {
            restrict: 'AE',
            replace: true,
            terminal: true,
            scope: { date: '=', mindate: '=', maxdate: '=', phtext: '=', onDateChange: "&" },
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
                                    '<input class="form-control rt-normal-input" value="{{dateDisplayStr}}" ng-click="openCalendar($event)" placeholder="{{phtext}}" />'+
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
                scope: { countries: '=', search: '=', airports: '=', targetairport: '=', routes: '=', filteraparray : '=', filterairport : '=', onAirportChange : '&' },
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
                        console.log('firing the event onAirportChange');
                        scope.onAirportChange();
                    };

                    scope.onPanelBlur = function(){
                        console.log('onPanelBlur fired');
                        //scope.onCursorBlur();
                    };

                    scope.$watch('filterairport.iataCode',function(newValue, oldValue){
                        console.log('filterairport value changed:');
                        console.log(oldValue);
                        console.log(newValue);

                        if(newValue == ''){
                            scope.afterFilterAirportArray = airports;
                        }

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

                    var template =  '<div class="">'+
                                        '<div class="row country-airport-title-row">'+
                                            '<div class="col-lg-17 country-title-div">SELECT COUNTRY</div>'+
                                            '<div class="col-lg-7 airport-title-div">SELECT AIRPORT</div>'+
                                        '</div>'+
                                        '<div class="row" ng-blur="onPanelBlur()">'+
                                            '<div class="col-lg-17 countries-div">'+
                                                '<ul>'+
                                                    '<li class="country-selector-div" ng-class="{\'high-light\': country.searchMatched}" ng-repeat="country in countries | hightLightCountry : search : afterFilterCountryArray" ng-click="selectCountry(country)">{{country.name}}</li>'+
                                                '</ul>'+
                                            '</div>'+
                                            '<div class="col-lg-7 airports-div">'+
                                                '<div class="row">'+
                                                    '<div class="col-lg-24 airport-selector-div" ng-repeat="airport in airports | filterAirport : search : selectedCountry : afterFilterAirportArray" ng-click="selectAirport(airport)">{{airport.name}}</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>' +
                                    '</div>';
                    

                    $compile(element.html(template).contents())(scope);
                }
            }
            
    }]).directive("outsideClick", ['$document','$parse', function( $document, $parse ){
        return {
            link: function( $scope, $element, $attributes ){
                var scopeExpression = $attributes.outsideClick,
                    onDocumentClick = function(event){

                        var checkHasClass = function(targetElement){
                            //console.log('target element is:');
                            //console.log(targetElement);

                            if(null == targetElement || 
                                'undefined' == targetElement){
                                return false;
                            }

                            //console.log(targetElement.className);
                            var checkResult = false;
                            if( targetElement.className !== 'undefined' &&
                                -1 !== targetElement.className.indexOf('city-airport-container')){
                                return true;
                            }
                            //console.log('dont have the class name');

                            if( targetElement.parentElement !== 'undefined'){
                                //console.log('has parent,next level =>');
                                //console.log(targetElement.parentElement);
                                
                                    if(true == checkHasClass(targetElement.parentElement)) {
                                        return true;
                                    }
                            }

                            return checkResult;
                        }

                        /*console.log('the $element is:');
                        console.log($element);
                        console.log('event.target is:');
                        console.log(event.target);
                        console.log(angular.element(event.target));
                        console.log(angular.element(event.target)[0]);
                        console.log('countries divs are:');
                        console.log(angular.element($document[0].querySelector('.countries-div'))[0]);
                        console.log('find result:');*/
                        //console.log($element.find(angular.element(document.getElementsByClassName("countries-div") )[0]));


                        //var isChild = $element.find(event.target).length > 0;
                        //var isChild = $element.find(angular.element($document[0].querySelector('.countries-div'))[0]).length > 0;
                        var isChild = checkHasClass(angular.element(event.target)[0] );
                        


                        if(!isChild) {
                            $scope.$apply(scopeExpression);
                        }
                    };

                $document.on("click", onDocumentClick);

                $element.on('$destroy', function() {
                    $document.off("click", onDocumentClick);
                });
            }
        }
    }]);