import { City } from '../pojo/city';
import { Person } from '../pojo/person';
import { Gender } from '../pojo/gender';
import { Status } from '../pojo/status';
import { Occupation } from '../pojo/occupation';
import { Transportation } from '../pojo/transportation';
import { MaritalStatus } from '../pojo/maritalstatus';

//import { DatePipe }    from '@angular/common';

export class User extends Person {
/*  id: string;
  fName: string;
  lName: string;
  email: string;
  city: City;
  address: string;
  tel: string;
  mobile: string;*/
  college: string;
  university: string;
  primarySchool : string;
  statusValidityDate : number;
  status: Status;
  gender: Gender;
  occupation: Occupation;
  maritalStatus : MaritalStatus;
  dateOfBirth: number;
  transportation: Transportation;
  nbChildren: number;
  constructor() {super()}
}


export class UserQuery {
  gender: string;
  maritalStatus : string;
  occupation : string;
  city : string;
  status: string;
  bDayFrom: any;
  bDayTo: any;
  bDateFrom: any;
  bDateTo: any; 
  district: string; 
  radius: string;
  fname : string;
  lname : string;  
  transportation: string;
  nbChildren: number;
  nbChildrenLimit: string;

  public normalize () : UserQuery {

    let result : UserQuery = new UserQuery();

    result.gender = !this.gender || this.gender === "-1" ? null : this.gender;
    result.maritalStatus = !this.maritalStatus || this.maritalStatus === "-1" ? null : this.maritalStatus;
    result.occupation = !this.occupation || this.occupation === "-1" ? null : this.occupation;
    result.status = !this.status || this.status === "-1" ? null : this.status;
    result.transportation = !this.transportation || this.transportation === "-1" ? null : this.transportation;
    
    result.radius = !this.radius || this.radius === "None" ? null : this.radius;
    result.fname = !this.fname || this.fname === "" ? null : this.fname;
    result.lname = !this.lname || this.lname === "" ? null : this.lname;

    result.nbChildren = this.nbChildren;
    result.nbChildrenLimit = this.nbChildrenLimit;

    result.district = !this.district || this.district === "All" ? null : this.district;
    result.city = !this.city || this.city === "-1" ? null : this.city;

    result.bDayFrom = this.bDayFrom.valueOf();
    result.bDayTo = this.bDayTo.valueOf();
    result.bDateFrom = this.bDateFrom.valueOf();
    result.bDateTo = this.bDateTo.valueOf();

    
/*
    result.bDayFrom = !this.bDayFrom || this.bDayFrom === "" ? null : this.bDayFrom;
    result.bDayTo = !this.bDayTo || this.bDayTo === "" ? null : this.bDayTo;
    result.bDateFrom = !this.bDateFrom || this.bDateFrom === "" ? null : this.bDateFrom;
    result.bDateTo = !this.bDateTo || this.bDateTo === "" ? null : this.bDateTo;
*/
    return result;
    
  }

 constructor() {
    this.gender = "-1";
    this.maritalStatus = "-1";
    this.occupation = "-1";
    this.status = "-1";

    this.transportation= "-1";
    this.nbChildren =0 ;
    this.nbChildrenLimit= "At least";
    
    this.radius = "None";
    this.fname = "";
    this.lname = "";
    
    this.district = "All";
    this.city = "-1";

    this.bDayFrom = 0;
    this.bDayTo = 0;
    this.bDateFrom = 0;
    this.bDateTo = 0;

  }


}

