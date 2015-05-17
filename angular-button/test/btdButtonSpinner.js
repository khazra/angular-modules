(function() {

    'use strict';

    describe('Directive btdButtonSpinner', function() {

        var compile,
            rootScope,
            directiveElement;

        function createDirectiveElement() {
            directiveElement = angular.element('<button type="submit" btd-button-spinner="buttonAction"></button>');
            compile(directiveElement)(rootScope);
            rootScope.$apply();
        }

        beforeEach(function() {

            module('btd.button');

            inject(['$injector',
                function($injector) {
                    compile = $injector.get('$compile');
                    rootScope = $injector.get('$rootScope');
                }
            ]);

            spyOn($.fn, 'find').and.callThrough();
            spyOn($.fn, 'hide').and.callThrough();
            spyOn($.fn, 'show').and.callThrough();
            spyOn($.fn, 'prop').and.callThrough();
            spyOn(rootScope, '$watch').and.callThrough();

        });

        it('should call $.fn.find with proper parameter on directive element', function() {
            createDirectiveElement();
            expect($.fn.find).toHaveBeenCalledWith('.btd-btn-spinner');
        });

        it('should call $.fn.hide on spinner element', function() {
            createDirectiveElement();
            expect($.fn.hide).toHaveBeenCalled();
        });

        it('should not call $watch on rootscope, when there is no rootscope.buttonActionInProgress specified', function() {
            createDirectiveElement();
            expect(rootScope.$watch).not.toHaveBeenCalled();
        });

        describe('when there is scope.buttonActionInProgress specified', function() {

            beforeEach(function() {
                rootScope.buttonActionInProgress = {
                    buttonAction: false
                };
                createDirectiveElement();
            });

            it('should call $watch on scope', function() {
                expect(rootScope.$watch).toHaveBeenCalled();
            });

            it('should call $.fn.hide', function() {
                expect($.fn.hide).toHaveBeenCalled();
            });

            it('should call $.fn.prop with proper parameters', function() {
                expect($.fn.prop).toHaveBeenCalledWith('disabled', false);
            });

            describe('and buttonActionInProgress.buttonAction on rootscope is set to true', function() {

                beforeEach(function() {
                    rootScope.buttonActionInProgress = {
                        buttonAction: true
                    };
                    rootScope.$digest();
                });

                it('should call $.fn.show', function() {
                    expect($.fn.show).toHaveBeenCalled();
                });

                it('should call $.fn.prop with proper parameters', function() {
                    expect($.fn.prop).toHaveBeenCalledWith('disabled', 'disabled');
                });

            });

        });

    });

})();
