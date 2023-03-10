import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { VouchersGroupService } from '../service/vouchers-group.service';

@Component({
  selector: 'app-vouchers-groups-new',
  templateUrl: './vouchers-groups-new.component.html',
  styleUrls: ['./vouchers-groups-new.component.css'],
  providers: [VouchersGroupService],
})
export class VouchersGroupsNewComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
  })
  msgs: Message[] = [];
  disabledBtn = false;

  constructor(
    private voucherGroupService: VouchersGroupService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.disabledBtn = true;
    this.voucherGroupService.save(this.form.value).subscribe(
      () => {
        this.msgs.push({
          severity: "info",
          summary: "Saving Vouchers Group",
          detail: "OK",
        });
        this.router.navigate([".."], { relativeTo: this.route });
        this.disabledBtn = false;
      },
      (err) =>
      {
          this.disabledBtn = false;

          return this.msgs.push({
            severity: "error",
            summary: "Saving Vouchers Group",
            detail: err,
          });
        }
    );
  }

  onGoBack() {
    window.history.back();
  }
}
