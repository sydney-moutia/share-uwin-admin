import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { TopicNotification } from '../pojo/topic_notification';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  providers: [NotificationService],
})
export class NotificationListComponent implements OnInit {
  notifications: TopicNotification[];
  notifications$: Observable<TopicNotification[]>;

  constructor(
    private notificationService: NotificationService,
  ) { }

  private fetchNotifications() {
    this.notifications$ = this.notificationService
      .findAll()
      .pipe(tap(list => this.notifications = list as TopicNotification[]));
  }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  onGoBack() {
    window.history.back();
  }

  onCreated() {
    this.fetchNotifications();
  }
}
