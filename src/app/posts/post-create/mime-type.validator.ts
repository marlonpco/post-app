import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeTypeValidator = (control: AbstractControl):
  Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if(typeof(control.value) === 'string'){
      return of(null);
    }

    const file = control.value as File;
    const reader = new FileReader();
    const fileReaderObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
        reader.addEventListener('loadend', () => {
        const arr = new Uint8Array((reader.result as ArrayBuffer)).subarray(0, 4);
        //mime-type (0, 4)
        let header: string = "";
        let isValid: boolean = false;
        for (let i = 0; i < arr.length; i++){
          header += arr[i].toString(16);
        }
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if(isValid){
          observer.next(null);
        }else{
          observer.next({invalidMimeType: true});
        }
        observer.complete();
      });
      reader.readAsArrayBuffer(file);
    });
    return fileReaderObservable;
};
