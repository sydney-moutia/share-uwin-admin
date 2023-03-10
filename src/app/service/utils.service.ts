import { Injectable }    from '@angular/core';

@Injectable()
export class UtilsService {


    constructor() { }

    static copyInto(source: Object, dest: Object): void {
        if (source != null) {

            for (var key in source) {
                dest[key] = this.cloneObject(source[key]);
            }

        }
    }

    static cloneObject(obj): Object {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
    }

    static parseDate(strDate: string): Date {
        let parts = strDate.split("/");
        let dt: Date = new Date(parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10));
        return dt;

    }

    static formatDate(aDate: Date): string {
        if (aDate === null || aDate === undefined) return null;
        let dd: any = aDate.getDate();
        let mm: any = aDate.getMonth() + 1; //January is 0! 
        let yyyy: any = aDate.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        return dd + '/' + mm + '/' + yyyy;
    }
}