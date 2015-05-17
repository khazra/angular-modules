(function() {

    'use strict';

    angular
        .module('btd.form')
        .directive('btdVerifyEqual', [btdVerifyEqual]);

    function btdVerifyEqual() {
        return {
            restrict: 'A',
            require: ['ngModel', '^form'],
            link: function(scope, el, attrs, Ctrls) {

                var ngModelCtrl = Ctrls[0];
                var formCtrl = Ctrls[1];

                ngModelCtrl.$parsers.unshift(function(viewValue) {

                    scope.$watchCollection(function() {
                        return [viewValue, formCtrl[attrs.btdVerifyEqual].$viewValue];
                    }, function(newValues) {

                        var val1 = viewValue;
                        var val2 = newValues[1];

                        if (val1 !== val2) {
                            ngModelCtrl.$setValidity('equals', false);
                        } else {
                            ngModelCtrl.$setValidity('equals', true);
                        }

                    });

                    return viewValue;

                });

            }
        };
    }

})();