import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/primeng";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Mission } from "../pojo/mission";
import { VouchersGroup } from "../pojo/vouchers_group";
import { MissionService } from "../service/mission.service";
import { VouchersGroupService } from "../service/vouchers-group.service";

@Component({
  selector: "app-mission-edit",
  templateUrl: "./mission-edit.component.html",
  styleUrls: ["./mission-edit.component.css"],
  providers: [MissionService, VouchersGroupService],
})
export class MissionEditComponent implements OnInit {
  mission$: Observable<Mission>;
  form = new FormGroup({
    title: new FormControl("", Validators.required),
    rewardType: new FormControl("", Validators.required),
    voucherGroup: new FormControl(""),
    points: new FormControl(""),
    tokens: new FormControl(""),
    task: new FormControl("", Validators.required),
    url: new FormControl(""),
    isActive: new FormControl(""),
  });
  disabledBtn = false;
  msgs: Message[] = [];
  vouchersGroups: VouchersGroup[];
  vouchersGroups$: Observable<VouchersGroup[]>;
  showVouchersGroups$ = new BehaviorSubject<boolean>(false);
  showPoints$ = new BehaviorSubject<boolean>(false);
  showTokens$ = new BehaviorSubject<boolean>(false);
  showUrl$ = new BehaviorSubject<boolean>(false);
  id: string;

  constructor(
    private vouchersGroupsService: VouchersGroupService,
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form
      .get("rewardType")
      .valueChanges.map((value) => value === "voucherGroup")
      .subscribe(this.showVouchersGroups$);
    this.form
      .get("rewardType")
      .valueChanges.map((value) => value === "myVoicePoint")
      .subscribe(this.showPoints$);
    this.form
      .get("rewardType")
      .valueChanges.map((value) => value === "uWinToken")
      .subscribe(this.showTokens$);
    this.form
      .get("task")
      .valueChanges.map((value) => value === "questionnaire")
      .subscribe(this.showUrl$);

    this.vouchersGroups$ = this.vouchersGroupsService
      .fetchAll()
      .map((list) => (this.vouchersGroups = list));

    this.mission$ = this.route.params
      .switchMap(({ id }) => this.missionService.findOne(id))
      .map((mission) => {
        this.id  = mission.id;
        const {
          title,
          rewardType,
          isActive,
          points,
          task,
          tokens,
          url,
          voucherGroup,
        } = mission;
        this.form.reset({
          title,
          rewardType,
          isActive,
          points,
          task,
          tokens,
          url,
          voucherGroup,
        });

        return mission;
      });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.disabledBtn = true;
    const values = this.form.value;
    const mission: Mission = {
      id: this.id,
      title: values.title,
      rewardType: values.rewardType,
      voucherGroup: values.voucherGroup,
      points: parseFloat(values.points) || 0,
      tokens: parseFloat(values.tokens) || 0,
      task: values.task,
      url: values.url,
      isActive: values.isActive === "true",
    }

    this.missionService.update(mission).subscribe(
      () => {
        this.disabledBtn = false;
        this.router.navigate(["../.."], { relativeTo: this.route });
        this.msgs.push({
          severity: "info",
          summary: "Saving Mission",
          detail: "OK",
        });
      },
      (err) => {
        this.disabledBtn = false;
        return this.msgs.push({
          severity: "error",
          summary: "Saving Mission",
          detail: err,
        });
      }
    );
  }
}
