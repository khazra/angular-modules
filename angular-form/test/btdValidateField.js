(function() {

    'use strict';

    describe('Directive btdValidateField', function() {

        var $compile,
            $rootScope,
            $templateCache,
            directiveScope,
            formElement,
            directiveElement,
            inputElement,
            FormCtrl,
            InputCtrl,
            FormErrorMessages;

        beforeEach(function() {

            FormErrorMessages = {};

            module('btd.form', ['$provide',
                function($provide) {
                    $provide.value('FormErrorMessages', FormErrorMessages);
                }
            ]);

            inject(['$injector',
                function($injector) {
                    $templateCache = $injector.get('$templateCache');
                    $compile = $injector.get('$compile');
                    $rootScope = $injector.get('$rootScope');
                }
            ]);

            $templateCache.put('/angular-form/templates/formErrors.html', '<div></div>');

            formElement = angular.element('<form name="form"></form>');
            $compile(formElement)($rootScope);
            FormCtrl = formElement.controller('form');

            directiveElement = angular.element('<div btd-validate-field="fieldName"></div>');
            $compile(directiveElement)($rootScope);

            inputElement = angular.element('<input type="url" name="fieldName" ng-model="fieldName" required />');
            $compile(inputElement)($rootScope);
            InputCtrl = inputElement.controller('ngModel');

            FormCtrl.fieldName = InputCtrl;

            formElement.append(directiveElement);
            directiveElement.append(inputElement);

            directiveScope = directiveElement.scope();
            directiveScope.$apply();

        });

        it('should have field defined on scope', function() {
            expect(directiveScope.field).toBeDefined();
        });

        it('should have formErrorMessages defined on scope', function() {
            expect(directiveScope.formErrorMessages).toBeDefined();
        });

        it('should have showValidationMessages defined on scope with false value', function() {
            expect(directiveScope.showValidationMessages).toBe(false);
        });

        it('should not show validation messages, when field is valid', function() {
            directiveScope.field.$setViewValue('http://example.com');
            $rootScope.$digest();
            expect(directiveScope.showValidationMessages).toBe(false);
        });

        it('should show validation messages, when field has incorrect value', function() {
            directiveScope.field.$setViewValue('example.com');
            $rootScope.$digest();
            expect(directiveScope.showValidationMessages).toBe(true);
        });

        it('should show validation messages, when field is empty', function() {
            directiveScope.field.$setViewValue('');
            $rootScope.$digest();
            expect(directiveScope.showValidationMessages).toBe(true);
        });

        it('should show validation messages, when field is empty', function() {
            directiveScope.field.$setViewValue('');
            $rootScope.$digest();
            expect(directiveScope.showValidationMessages).toBe(true);
        });

    });


})();