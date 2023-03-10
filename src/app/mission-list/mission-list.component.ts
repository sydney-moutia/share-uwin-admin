import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Mission } from '../pojo/mission';
import { MissionService } from '../service/mission.service';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css'],
  providers: [MissionService]
})
export class MissionListComponent implements OnInit {
  list$: Observable<Mission[]> | undefined;
  list: Mission[] | undefined;

  constructor(
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._fetchData();
  }

  onGoBack() {
    window.history.back();
  } 

  onNewItem() {
    this.router.navigate(["new"], {relativeTo: this.route});
  }

  onRowSelect(event: { data: Mission }) {
    this.router.navigate([event.data.id, "edit"], {relativeTo: this.route});
  }

  onDeactivateRoute() {
    this._fetchData();
  }

  _fetchData() {
    this.list$ = this.missionService.findAll().map((list) => this.list = list);
  }
}
