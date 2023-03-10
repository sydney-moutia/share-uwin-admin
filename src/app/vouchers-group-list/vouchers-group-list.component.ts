import { Component, OnDestroy, OnInit } from '@angular/core';
import {Message} from 'primeng/primeng';
import { VouchersGroupService } from '../service/vouchers-group.service';
import { VouchersGroup } from '../pojo/vouchers_group';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vouchers-group-list',
  templateUrl: './vouchers-group-list.component.html',
  styleUrls: ['./vouchers-group-list.component.css'],
  providers: [VouchersGroupService],
})
export class VouchersGroupListComponent implements OnInit, OnDestroy {
  error: any;
  list: VouchersGroup[];
  selectedGroup: VouchersGroup;
  isAdmin : boolean;
  msgs: Message[] = [];
  sub: Subscription;

  constructor(
    private vouchersGroupService: VouchersGroupService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.sub = this.vouchersGroupService.fetchAll()
      .subscribe((list) => this.list = list);
  }

  onRowSelect(event: { data: VouchersGroup }) {
    this.selectedGroup = event.data;
  }

  onGoBack() {
    window.history.back();
  } 

  onNewItem() {
    this.router.navigate(["new"], {relativeTo: this.route});
  }
}
