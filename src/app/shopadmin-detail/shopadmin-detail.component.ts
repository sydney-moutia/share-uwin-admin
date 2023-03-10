import { Component, OnInit, Input, OnChanges, SimpleChanges, Output,EventEmitter} from '@angular/core';
import { ShopAdmin } from '../pojo/shopadmin';
import { Role } from '../pojo/role';
import { ShopAdminService } from '../service/shopadmin.service';
import {Message} from 'primeng/primeng';
import {Validators, FormControl, FormGroup,ReactiveFormsModule,FormsModule} from '@angular/forms';
import { UtilsService } from '../service/utils.service'
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-shopadmin-detail',
  templateUrl: 'shopadmin-detail.component.html',
  styleUrls: ['shopadmin-detail.component.css'],
  providers: [ShopAdminService],
})


export class ShopAdminDetailComponent implements OnInit, OnChanges {
  @Input() shopAdmin: ShopAdmin;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Input() inDialog: boolean = false;

  userformShopAdmin: FormGroup;

  msgs: Message[] = [];

  roles: Role[];

  origRole : Role;

  idCurrentShopAdmin : string;

  shopAdminCopy: ShopAdmin = new ShopAdmin();

  constructor(
    private shopAdminService: ShopAdminService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    // get shopAdmin object if id provided from router
    /*
     this.route.params.forEach((params: Params) => {
        let id = params['id'];
        this.getUserAdmin(id);
     });
    */
    this.idCurrentShopAdmin = localStorage.getItem('auth_id');

    this.userformShopAdmin = new FormGroup({
      fName: new FormControl('', Validators.required),
      lName: new FormControl('', Validators.required),
      email: new FormControl('',  Validators.required),
      role: new FormControl('',  Validators.required),
      pwd: new FormControl('',  Validators.required),
      tel:   new FormControl('',  null),
      mobile:new FormControl('',  null)
      
    });

    this.getRoles();
  }

  getUserAdmin(id: string): void {
      this.shopAdminService.getShopAdmin(id).subscribe(
      shopAdmin => {
        this.shopAdmin = shopAdmin;
      },
      error => this.msgs.push({ severity: 'error', summary: 'Role List', detail: error })
    );
  }

  getRoles(): void {
    this.shopAdminService.getRoleList().subscribe(
      roles => {
        this.roles = roles;

      
      },
      error => this.msgs.push({ severity: 'error', summary: 'Role List', detail: error })
    );
  }

  onCancel() {
    UtilsService.copyInto(this.shopAdminCopy, this.shopAdmin);
    //this.shopAdmin.role = new Role(this.shopAdminCopy.role.id, this.shopAdminCopy.role.label);
    this.shopAdmin.role = this.shopAdminCopy.role;
    this.userformShopAdmin.markAsPristine();

  }  


  onDelete() {
    if (this.shopAdmin !== null && this.shopAdmin.id !== null)
      this.shopAdminService.deleteShopAdmin(this.shopAdmin).subscribe(
        response => {
          if (response === "ok") {
            /*
            if (this.itemList) {
              let indx = this.itemList.findIndex(anItem => anItem === this.item);
              this.itemList.splice(indx, 1);
            }
            this.item = null;
            */
            this.deleted.emit(this.shopAdmin);
          }
        },

        // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
        error => this.msgs.push({ severity: 'error', summary: 'Saving Shop', detail: error })
      );
  }




  onSubmit() {
    this.msgs = [];

    let newItem = (this.shopAdmin.id === null);

    this.shopAdminService.createOrUpdateShopAdmin(this.shopAdmin)
      .subscribe(

      id => {
        this.shopAdmin.id = id;
        this.saved.emit(this.shopAdmin);
        UtilsService.copyInto(this.shopAdmin, this.shopAdminCopy);
        this.shopAdminCopy.role = new Role(this.shopAdmin.role.id, this.shopAdmin.role.label);      
        this.userformShopAdmin.markAsPristine();
      },

      // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
      error => {
          if (!this.inDialog) this.msgs.push({ severity: 'error', summary: 'Saving Shop Admin', detail: error });
          else window.alert(error);
      }
      );
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['shopAdmin'] != undefined) {
      let changedItem = changes['shopAdmin'].currentValue;
      if (changedItem != undefined && changedItem.id != null) {
          UtilsService.copyInto(this.shopAdmin, this.shopAdminCopy);
          if (this.shopAdmin.role) {
              this.shopAdmin.role = this.roles.find((aRole) => { return (aRole.id === this.shopAdmin.role.id)} );
          }

          this.shopAdminCopy.role =  this.shopAdmin.role; //new Role(this.shopAdmin.role.id, this.shopAdmin.role.label);
          //this.shopAdminCopy.role  = this.shopAdmin.role;
      }
     
    }
  }  

}
