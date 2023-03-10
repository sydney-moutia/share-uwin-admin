export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'invalidNumberFormat' : "Number is required",
            "pattern" : "Invalid format",
            "validateMaxValue" : `Maximum value ${validatorValue}`,
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }
/*
    static numberValidator(control) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[1-9]\d*(\.\d+)?$/) != null) {
            return null;
        } else {
            return { 'invalidNumberFormat': true };
        }
    }   */ 

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
}


