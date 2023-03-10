import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[maxValue][formControlName],[maxValue][formControl],[maxValue][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxValueValidator), multi: true }
    ]
})
export class MaxValueValidator implements Validator {
    constructor(@Attribute('maxValue') public maxValue: number) {
    }


    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        let v = c.value;

        // control vlaue
        //let e = c.root.get(this.maxValue);

        // value not equal
        if (this.maxValue && v > this.maxValue) {
            return {
                validateMaxValue: this.maxValue
            }
        }

        // value equal and reverse
        /*
        if (this.maxValue && v <= this.maxValue) {
            //delete this.errors['maxValue'];
            //if (!Object.keys(e.errors).length) e.setErrors(null);
        }
*/
        return null;
    }
}