angular.module('rt.functions', [])
    .factory('Functions', ['$rootScope', '$config', function ($rootScope, $config) {

        var numeric_sort = function (a, b) {
            return a - b;
        }

        var in_array = function (needle, haystack) {
            var length = haystack.length;
            for (var i = 0; i < length; i++) {
                if (haystack[i] == needle) return true;
            }
            return false;
        };

        var isEmpty = function(targetObj){
            var hasOwnProperty = Object.prototype.hasOwnProperty;

            if (targetObj == null) return true;

            if (targetObj.length > 0)    return false;
            if (targetObj.length === 0)  return true;

            for (var key in targetObj) {
                if (hasOwnProperty.call(targetObj, key)) return false;
            }

            return true;
        }

        var getReadableDateStr = function (dateStr) {
           
            var monthNames = [ "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December" ];
            var dateObj = new Date(dateStr);
            //TODO: validate the dateObj
            var resultStr = dateObj.getDate()+' '+monthNames[dateObj.getMonth()]+' '+dateObj.getFullYear();

            return resultStr;    
        };

        var getReadableDateStrFromDate = function(dateObj){

            dateObj = (dateObj instanceof Date) ? dateObj : new Date(dateObj);

            var dd  = dateObj.getDate().toString();

            return getWeekDayLongName(dateObj.getDay()) + ', '+getMonthShortName(dateObj.getMonth())+ ' '+ (dd[1]?dd:"0"+dd[0]) + ' '+dateObj.getFullYear();  
        }

        var getSearchStdDateStr = function(dateObj){
            /*String format: yyyy-mm-dd*/
            if( dateObj && 
                dateObj instanceof Date){

                var yyyy = dateObj.getFullYear().toString();
                var mm = (dateObj.getMonth()+1).toString();
                var dd  = dateObj.getDate().toString();

                return '' + yyyy+'-'+(mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            }

            return '';
        };

        var getWeekDayShortName = function (index){
            var weekDayShortNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

            return (isNumber(index) && 0 <= index && 6>=index) ? weekDayShortNames[index] : '';
        };

        var getWeekDayLongName = function (index){
            var weekDayShortNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

            return (isNumber(index) && 0 <= index && 6>=index) ? weekDayShortNames[index] : '';
        };

        var getMonthShortName = function(index){
            var monthShortNames = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];

            return (isNumber(index) && 0 <= index && 11>=index) ? monthShortNames[index] : '';
        };


        var deepClone = function(targetObj){
            var clonedObj;

            //is an array?
            if(isArray(targetObj)){
                //console.log('the targetObj is array:');
                //console.log(targetObj);
                clonedObj = []; 


                for(var key in targetObj){
                    //console.log("the key value is:"+key+" :"+targetObj[key]);
                    clonedObj[key] = deepClone(targetObj[key]);
                }
            }
            //is object ?
            else if(isObject(targetObj) ){
                clonedObj = new Object();
                //console.log('it is an object');
                //console.log(targetObj);

                for(var prop in targetObj){
                    if( isObject(targetObj[prop])  || 
                        isArray(targetObj[prop]) ){
                        
                        
                        if( prop.toLowerCase == "promise" ||
                            prop.substr(0,1) == '$' ||
                            prop.substr(0,1) == '_'){
                            continue;
                        }

                        //console.log('the '+prop+' is type of object');
                        //console.log(targetObj[prop]);

                        clonedObj[prop] = deepClone(targetObj[prop]);

                        //deepClone(targetObj[prop]);
                    }
                    else{
                        clonedObj[prop] = targetObj[prop];
                    }
                }
            }
            else{
                //console.log('not object or array:'+targetObj);
                clonedObj = targetObj;
            }

            
            return clonedObj;
        }

        var shallowClone = function(obj){

            if (!isObject(obj)) return obj;
            return isArray(obj) ? obj.slice() : extendObj(obj);
            
        };

        var isObject = function(obj) {
            return obj === Object(obj);
        };

        var isArray = function(obj){
            return toString.call(obj) == '[object Array]';
        };

        var extendObj = function(obj) {
            var extendedOb = {};
        
            if (obj) {
                for (var prop in obj) {
                    extendedOb[prop] = obj[prop];
                }
            }
            return extendedOb;
      };

        var deepCloneArray = function(targetArray){
            var clonedArray = $.extend(true, [], targetArray);

            //console.log('the cloned array is:');
            //console.log(clonedArray);
            //clonedArray.shift().shift();

            //console.log(clonedArray);
            return clonedArray;
        };


        var mobileCheck = function(){
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check; 
        };

        //function from stackoverflow
        var isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        var getRandomSingleInteger = function(){
            return String.fromCharCode( parseInt(Math.random() * (58-44) + 48) );
        };

        var getRandomChar   = function(){
            return String.fromCharCode( parseInt(Math.random() * (91-65) + 65) );
        }

        //define functions for IE browser
        if(typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, ''); 
            }
        }

        return {
            in_array:       in_array,
            isEmpty:        isEmpty,
            numeric_sort:   numeric_sort,
            deepClone :             deepClone,
            deepCloneArray:         deepCloneArray,
            getSearchStdDateStr : getSearchStdDateStr,
            getReadableDateStr  :  getReadableDateStr,
            getReadableDateStrFromDate : getReadableDateStrFromDate,
            getMonthShortName   :    getMonthShortName,
            getWeekDayLongName  :   getWeekDayLongName,
            mobileCheck         :   mobileCheck,
            isNumber            :   isNumber,
            isEmpty             :   isEmpty,
            getRandomSingleInteger : getRandomSingleInteger,
            getRandomChar       : getRandomChar

        };

    }]);