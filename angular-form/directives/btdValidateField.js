(function() {

    'use strict';

    angular
        .module('btd.form')
        .directive('btdValidateField', ['FormErrorMessages', '$window', '$log', btdValidateField]);

    function btdValidateField(FormErrorMessages, $window, $log) {
        return {
            restrict: 'A',
            require: '^form',
            transclude: true,
            scope: true,
            templateUrl: '/angular-form/templates/formErrors.html',
            link: function($scope, $el, $attrs, FormCtrl) {

                var validatedEl = $($el[0]).find('input') || $($el[0]).find('select') || $($el[0]).find('textarea');
                var formEl = $($el[0]).closest('form');

                if ($window.angular.isUndefined($attrs.btdValidateField) ||
                    $attrs.btdValidateField === '') {
                    throw 'btd-validate attribute must contain name of validated input';
                }

                $scope.field = FormCtrl[$attrs.btdValidateField];
                $scope.formErrorMessages = FormErrorMessages;
                $scope.showValidationMessages = false;

                validatedEl.on('blur', function() {
                    if ($window.angular.isUndefined($scope.field.$viewValue)) {
                        $scope.$apply(function() {
                            $scope.field.$setViewValue('');
                            $scope.showValidationMessages = true;
                        });
                    }
                });

                formEl.on('submit', function(submitEvent) {

                    if ($window.angular.isUndefined(FormCtrl)) {
                        return;
                    }

                    if (FormCtrl.$valid) {
                        $log.debug('Form is valid!');
                        return;
                    }

                    submitEvent.preventDefault();
                    formEl.find('.ng-pristine').removeClass('ng-pristine');

                    if (!$scope.field.$valid) {

                        $log.debug('Field "' + $attrs.btdValidateField + '" is invalid!');

                        $scope.$apply(function() {
                            formEl.find('.input-errors').removeClass('hidden');
                            $scope.showValidationMessages = true;
                        });

                        return;

                    }

                    $log.debug('Field "' + $attrs.btdValidateField + '" is valid!');

                });

                $scope.$watchCollection(function() {
                    return [$scope.field.$valid, $scope.field.$pristine];
                }, function(fieldValues) {
                    if (fieldValues[0] || fieldValues[1]) {
                        $scope.showValidationMessages = false;
                        return;
                    }
                    formEl.find('.input-errors').removeClass('hidden');
                    $scope.showValidationMessages = true;
                });

            }
        };
    }

})();