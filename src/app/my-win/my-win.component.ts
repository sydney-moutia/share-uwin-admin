import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyWinMenuItemService } from '../service/my-win-menu-item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MyWinMenuItem } from '../pojo/my_win_menu_item';

@Component({
  selector: 'app-my-win',
  templateUrl: './my-win.component.html',
  styleUrls: ['./my-win.component.css'],
  providers: [MyWinMenuItemService],
})
export class MyWinComponent implements OnInit {
  myWinMenuItems$: Observable<MyWinMenuItem[]>;
  myWinMenuItems: MyWinMenuItem[];
  showPreloader = true;

  constructor(
    private myWinMenuItemService: MyWinMenuItemService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.fetchMyWinMenuItems();
  }

  fetchMyWinMenuItems(): void {
    this.showPreloader = true;
    this.myWinMenuItems$ = this.myWinMenuItemService.fetchAll()
      .map((list) => {
        this.myWinMenuItems = list;
        this.showPreloader = false;

        return list;
      });
  }
  
  onRowSelect(event) {
    const it: MyWinMenuItem = event.data;
    this.router.navigate([it.id, 'edit'], {relativeTo: this.route});
  }
}
