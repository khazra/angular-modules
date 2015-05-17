(function() {

    'use strict';

    describe('Directive btdVerifyEqual', function() {

        var compile,
            rootScope,
            FormCtrl,
            ngModelCtrl,
            formElement,
            directiveElement;

        function createDirectiveElement() {

            formElement = angular.element('<form name="form"><input ng-model="fieldToVerify" name="fieldToVerify" /></form>');
            directiveElement = angular.element('<input name="verifyingField" ng-model="verifyingField" btd-verify-equal="fieldToVerify" />');

            formElement.append(directiveElement);
            compile(formElement)(rootScope);
            FormCtrl = formElement.controller('form');

            compile(directiveElement)(rootScope);
            ngModelCtrl = directiveElement.controller('ngModel');

        }

        beforeEach(function() {

            module('btd.form');

            inject(['$injector',
                function($injector) {
                    compile = $injector.get('$compile');
                    rootScope = $injector.get('$rootScope');
                }
            ]);

            createDirectiveElement();

            spyOn(rootScope, '$watchCollection').and.callThrough();
            spyOn(ngModelCtrl.$parsers, 'unshift').and.callThrough();

        });

        describe('when directive element value is changed', function() {

            beforeEach(function() {
                ngModelCtrl.$setViewValue('test');
                rootScope.$digest();
            });

            it('should call $watchCollection on rootscope', function() {
                expect(rootScope.$watchCollection).toHaveBeenCalled();
            });

            it('should set directive element validation to error state with proper error key, when its value doesnt match fieldToVerify value', function() {
                FormCtrl.fieldToVerify.$setViewValue('tests');
                rootScope.$digest();
                expect(ngModelCtrl.$error).toEqual({
                    equals: true
                });
            });

            it('should set directive element validation to success state with proper error key, when its value doesnt match fieldToVerify value', function() {
                FormCtrl.fieldToVerify.$setViewValue('test');
                rootScope.$digest();
                expect(ngModelCtrl.$error).toEqual({
                    equals: false
                });
            });

        });


    });


})();