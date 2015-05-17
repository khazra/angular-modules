(function() {

    'use strict';

    angular
        .module('btd.button')
        .directive('btdButtonSpinner', ['$log', btdButtonSpinner]);

    function btdButtonSpinner($log) {
        return {
            restrict: 'A',
            transclude: true,
            template: '<span data-ng-transclude></span>' +
                '<span class="btd-btn-spinner">' +
                '<i class="fa fa-spinner fa-spin"></i>' +
                '</span>',
            link: function(scope, el, attrs) {

                var spinner = $(el).find('.btd-btn-spinner');
                $(spinner).hide();

                if (angular.isUndefined(scope.buttonActionInProgress)) {
                    return;
                }

                scope.$watch(function() {
                    return scope.buttonActionInProgress[attrs.btdButtonSpinner];
                }, function(newButtonActionInProgressValue) {

                    if (angular.isUndefined(newButtonActionInProgressValue)) {
                        return;
                    }

                    $log.debug('Button action in progress:', attrs.btdButtonSpinner, newButtonActionInProgressValue);

                    if (newButtonActionInProgressValue === true) {
                        $(spinner).show();
                        $(el).prop('disabled', 'disabled');
                    }

                    if (newButtonActionInProgressValue === false) {
                        $(spinner).hide();
                        $(el).prop('disabled', false);
                    }

                });

            }
        };
    }

})();