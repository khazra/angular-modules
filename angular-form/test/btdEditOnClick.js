(function() {

    'use strict';

    describe('Directive btdEditOnClick', function() {

        var $compile,
            $rootScope,
            $scope,
            $templateCache,
            $timeout,
            scope,
            directiveElement,
            keyPressEvent,
            NumberHelper,
            valueField,
            inputField;

        beforeEach(function() {

            NumberHelper = jasmine.createSpyObj('NumberHelper', ['isASCII']);

            module('btd.form', ['$provide',
                function($provide) {
                    $provide.value('NumberHelper', NumberHelper);
                }
            ]);

            inject(['$injector',
                function($injector) {
                    $compile = $injector.get('$compile');
                    $rootScope = $injector.get('$rootScope');
                    $templateCache = $injector.get('$templateCache');
                    $timeout = $injector.get('$timeout');
                }
            ]);

            $templateCache.put('/angular-form/templates/editOnClick.html', '<div class="btd-edit-on-click-wrapper"><span data-ng-hide="editor.enabled">{{ prefix }}{{ value }}{{ suffix }}<i class="fa fa-pencil-square-o" data-ng-click="enableEditMode()"></i></span><div data-ng-show="editor.enabled"><input type="text" data-ng-model="value"></div>');
            $scope = $rootScope.$new();

            $scope.stringToEdit = 'example string';
            $scope.btdEditOnClickCallback = jasmine.createSpy('btdEditOnClickCallback');
            $scope.btdEditOnClickPrefix = 'pre-';
            $scope.btdEditOnClickSuffix = '-post';

            directiveElement = angular.element('<btd-edit-on-click model="stringToEdit" on-value-save="btdEditOnClickCallback()" value-prefix="btdEditOnClickPrefix" value-suffix="btdEditOnClickSuffix"></btd-edit-on-click>');
            $compile(directiveElement)($scope);
            $scope.$apply();

            scope = directiveElement.isolateScope();
            scope.$apply();

            keyPressEvent = {
                type: 'keypress',
                preventDefault: jasmine.createSpy('preventDefault')
            };

            inputField = directiveElement.find('input');
            valueField = directiveElement.find('span');

            spyOn(scope, '$apply').and.callThrough();
            spyOn(inputField[0], 'focus').and.callThrough();
            spyOn(scope, 'onValueSave').and.callThrough();
            spyOn(scope, 'enableEditMode').and.callThrough();
            spyOn(scope, 'disableEditMode').and.callThrough();
            spyOn(scope, 'saveChanges').and.callThrough();
            spyOn(scope, 'checkChanges').and.callThrough();

        });

        it('should have proper value set', function() {
            expect(scope.value).toBe('example string');
        });

        it('should have proper prefix set', function() {
            expect(scope.prefix).toBe('pre-');
        });

        it('should have proper suffix set', function() {
            expect(scope.suffix).toBe('-post');
        });

        it('should have editor disabled', function() {
            expect(scope.editor.enabled).toBeFalsy();
        });

        it('should not change scope.editor.enabled, if it is already true and scope.enableEditMode is called', function() {
            scope.editor.enabled = true;
            scope.enableEditMode();
            $timeout.flush();
            expect(scope.editor.enabled).toBeTruthy();
        });

        describe('when scope.enableEditMode is called and scope.editor.enabled is false', function() {

            beforeEach(function() {
                scope.enableEditMode();
                $timeout.flush();
            });

            it('should have editor start value properly set', function() {
                expect(scope.editor.startValue).toBe('example string');
            });

            it('should call scope.$apply', function() {
                expect(scope.$apply).toHaveBeenCalled();
            });

            it('should set scope.editor.enabled to true', function() {
                expect(scope.editor.enabled).toBeTruthy();
            });

            it('should focus input field', function() {
                expect(inputField[0].focus).toHaveBeenCalled();
            });

        });

        it('should not change scope.editor.enabled, if it is already false and scope.disableEditMode is called', function() {
            scope.editor.enabled = false;
            scope.disableEditMode();
            $timeout.flush();
            expect(scope.editor.enabled).toBeFalsy();
        });

        describe('when scope.disableEditMode is called and scope.editor.enabled is true', function() {

            beforeEach(function() {
                scope.disableEditMode();
                $timeout.flush();
            });

            it('should call scope.$apply', function() {
                expect(scope.$apply).toHaveBeenCalled();
            });

            it('should set scope.editor.enabled to false', function() {
                expect(scope.editor.enabled).toBeFalsy();
            });

        });

        it('should not call scope.onValueSave, when scope.checkChanges is called and editor text value has not changed', function() {
            scope.editor.startValue = 'string start value';
            scope.value = 'string start value';
            scope.checkChanges();
            expect(scope.onValueSave).not.toHaveBeenCalled();
        });

        describe('when scope.saveChanges is called and editor text value has changed', function() {

            beforeEach(function() {
                scope.editor.startValue = 'string start value';
                scope.value = 'changed string value';
                scope.saveChanges();
            });

            it('should se scope.startValue to scope.value', function() {
                expect(scope.editor.startValue).toBe('changed string value');
            });

            it('should call scope.onValueSave callback', function() {
                expect(scope.onValueSave).toHaveBeenCalled();
            });

        });

        it('should call scope.enableEditMode, when value field is clicked', function() {
            scope.enableEditMode.calls.reset();
            valueField.triggerHandler('click');
            expect(scope.enableEditMode).toHaveBeenCalled();
        });

        it('should call scope.enableEditMode, when value field is focused', function() {
            scope.enableEditMode.calls.reset();
            valueField.triggerHandler('focus');
            expect(scope.enableEditMode).toHaveBeenCalled();
        });

        describe('when input field is blured', function() {

            beforeEach(function() {
                scope.disableEditMode.calls.reset();
                scope.saveChanges.calls.reset();
                inputField.triggerHandler('blur');
            });

            it('should call scope.checkChanges', function() {
                expect(scope.checkChanges).toHaveBeenCalled();
            });

            it('should call scope.saveChanges', function() {
                expect(scope.saveChanges).toHaveBeenCalled();
            });

        });

        describe('when enter key is pressed', function() {

            beforeEach(function() {
                scope.disableEditMode.calls.reset();
                scope.saveChanges.calls.reset();
                keyPressEvent.preventDefault.calls.reset();
                keyPressEvent.which = 13;
                directiveElement.triggerHandler(keyPressEvent);
            });

            it('should call keyPressEvent.preventDefault', function() {
                expect(keyPressEvent.preventDefault).toHaveBeenCalled();
            });

        });

        describe('when escape key is pressed', function() {

            beforeEach(function() {
                scope.disableEditMode.calls.reset();
                scope.saveChanges.calls.reset();
                keyPressEvent.which = 27;
                scope.editor.startValue = 'string start value';
                scope.value = 'changed string value';
                directiveElement.triggerHandler(keyPressEvent);
            });

            it('should call keyPressEvent.preventDefault', function() {
                expect(keyPressEvent.preventDefault).toHaveBeenCalled();
            });

            it('should call scope.disableEditMode', function() {
                expect(scope.disableEditMode).toHaveBeenCalled();
            });

            it('should set scope.value to scope.editor.startValue', function() {
                expect(scope.value).toBe('string start value');
            });

        });

    });

})();