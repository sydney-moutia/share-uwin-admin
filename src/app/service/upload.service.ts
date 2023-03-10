import { Injectable }    from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Observer }     from 'rxjs/Observer';
import { HttpComService } from './httpcom.service'

@Injectable()
export class UploadService  {

    private progress: number = 0;

    private progress$: Observable<number>;

    private progressObserver: any = null;


    constructor() {
        
    }

    /**
 * @returns {Observable<number>}
 */
    public getObserver(): Observable<number> {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        });
        return this.progress$;
    }

    public makeFileRequest(url: string, files: File[]): Observable<any> {

        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                //formData.append("file", files[i], files[i].name);

                formData.append("file", files[i], "" + new Date().getTime() + files[i].name.substring(files[i].name.lastIndexOf('.'), files[i].name.length));

            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(xhr.response);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            UploadService.setUploadUpdateInterval(500);

            xhr.upload.onprogress = (event) => {
                if (this.progressObserver != null) {
                    this.progress = Math.round(event.loaded / event.total * 100);
                    this.progressObserver.next(this.progress);
                }
            };

            //this.headers.keys.forEach((header) => xhr.setRequestHeader(header.));

       
            xhr.open('POST', url, true);

        let authToken = localStorage.getItem('auth_token');
        // if (authToken!==undefined) this.headers.append('Authorization', `Bearer ${authToken}`);
        if (authToken!==undefined) xhr.setRequestHeader('Authorization', authToken);


            xhr.send(formData);
        });
    }



    /**
     * Set interval for frequency with which Observable inside Promise will share data with subscribers.
     *
     * @param interval
     */
    private static setUploadUpdateInterval(interval: number): void {
        setInterval(() => { }, interval);
    }
}