import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { take } from 'rxjs/operators';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  providers: [NotificationService],
})
export class NotificationDetailComponent {
  @Output() created: EventEmitter<any> = new EventEmitter();
  showSpinner = false;
  msgs: Message[] = [];
  form: FormGroup;

  constructor(
    private notificationService: NotificationService,
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (this.form.valid) {
      this.showSpinner = true;
      const title: string = this.form.get('title').value;
      const message: string = this.form.get('message').value;
      this.notificationService.sendNews(title, message)
        .pipe(take(1))
        .subscribe(
          _ => {
            this.msgs.push({ severity: 'info', summary: 'Notification sent', detail: '' });
            this.showSpinner = false;
            this.form = this.createForm();
            this.created.emit(title);
          },
          err => {
            console.error(err);
            this.msgs.push({ severity: 'error', summary: 'Could not send notification', detail: '' });
            this.showSpinner = false;
          }
        );
    }
  }
}
