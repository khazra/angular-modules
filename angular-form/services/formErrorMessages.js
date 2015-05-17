(function() {

    'use strict';

    angular
        .module('btd.form')
        .factory('FormErrorMessages', [FormErrorMessages]);

    function FormErrorMessages() {
        return {
            email: 'Provided e-mail address is incorrect',
            text: 'Field may contain text only',
            number: 'Field may contain numbers only',
            url: 'Field must contain valid url address',
            min: 'Provided value is too low',
            max: 'Provided value is too high',
            minlength: 'Provided value is too short',
            maxlength: 'Provided value is too long',
            required: 'Field is required',
            equals: 'The field must match above field`s value',
            default: 'Field contains incorrect data'
        };
    }

})();