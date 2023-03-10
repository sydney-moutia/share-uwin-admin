import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../service/validation.service';

@Component({
  selector: 'control-messages',
  template: `<div class="ui-message ui-messages-error ui-corner-all" *ngIf="errorMessage !== null"><i class="fa fa-exclamation-triangle"></i> {{errorMessage}}</div>`
})
export class ControlMessages {
  //private _errorMessage: string;
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && !this.control.pristine) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    
    return null;
  }
}
