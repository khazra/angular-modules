(function() {

    'use strict';

    angular
        .module('btd.form')
        .directive('btdEditOnClick', ['$window', '$log', '$timeout', btdEditOnClick]);

    function btdEditOnClick($window, $log, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/angular-form/templates/editOnClick.html',
            scope: {
                value: '=model',
                prefix: '=valuePrefix',
                suffix: '=valueSuffix',
                onValueSave: '&',
                minValue: '=minValue',
                maxValue: '=maxValue',
                valueType: '=valueType'
            },
            link: function(scope, element) {

                var valueField = element.find('span'),
                    inputField = element.find('input');

                scope.editor = {
                    enabled: false
                };

                scope.enableEditMode = function() {

                    $timeout(function() {

                        scope.$apply(function() {

                            if (scope.editor.enabled === true) {
                                return;
                            }

                            scope.editor.startValue = scope.value;

                            $log.debug('btdEditOnClick: edit mode on');

                            scope.editor.enabled = true;

                        });

                        inputField[0].focus();

                    });

                };

                scope.disableEditMode = function() {

                    $timeout(function() {
                        scope.$apply(function() {

                            if (scope.editor.enabled === false) {
                                return;
                            }

                            $log.debug('btdEditOnClick: edit mode off');

                            scope.editor.enabled = false;

                        });
                    });

                };

                scope.checkChanges = function() {

                    if (scope.editor.startValue === scope.value) {
                        scope.disableEditMode();
                        return;
                    }

                    scope.correctValues();

                };

                scope.saveChanges = function() {
                    scope.editor.startValue = scope.value;
                    scope.onValueSave();
                    scope.disableEditMode();
                };

                scope.cancelEdit = function() {
                    scope.value = scope.editor.startValue;
                    scope.disableEditMode();
                };

                scope.correctValues = function() {

                    var value, minValue, maxValue;

                    if (scope.valueType === 'integer') {

                        value = parseInt(scope.value);
                        minValue = parseInt(scope.minValue);
                        maxValue = parseInt(scope.maxValue);

                        if (isNaN(value)) {
                            scope.cancelEdit();
                            return;
                        }

                        scope.value = value;

                    }

                    if (scope.valueType === 'number') {

                        value = parseFloat(scope.value);
                        minValue = parseFloat(scope.minValue);
                        maxValue = parseFloat(scope.maxValue);

                        if (!angular.isNumber(value)) {
                            scope.cancelEdit();
                            return;
                        }

                        scope.value = value;

                    }

                    if (angular.isUndefined(scope.valueType) ||
                        scope.valueType === 'string') {

                        if (scope.value === '') {
                            scope.cancelEdit();
                            return;
                        }

                    }

                    if (angular.isDefined(scope.minValue) &&
                        scope.minValue !== '') {

                        if (value < minValue) {
                            scope.value = minValue;
                        }

                    }

                    if (angular.isDefined(scope.maxValue) &&
                        scope.maxValue !== '') {

                        if (value > maxValue) {
                            scope.value = maxValue;
                        }

                    }

                    scope.$apply();
                    scope.saveChanges();

                };

                valueField.bind('click focus', function() {
                    scope.enableEditMode();
                });

                inputField.bind('blur', function() {
                    scope.checkChanges();
                });

                element.bind('keydown keypress', function(event) {

                    if (event.which === 13) {
                        event.preventDefault();
                        inputField[0].blur();
                    }

                    if (event.which === 27) {
                        event.preventDefault();
                        scope.cancelEdit();
                    }

                });

            }
        };
    }

})();