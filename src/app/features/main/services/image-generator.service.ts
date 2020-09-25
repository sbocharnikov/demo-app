import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs/operators';

@Injectable()
export class ImageGeneratorService {
  private isLoadingSubject: Subject<boolean> = new Subject<boolean>();
  private apiUrl: string = 'https://loremflickr.com/320/240/';

  constructor(private http: HttpClient) { }

  get isLoading(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  generate(description: string): Observable<string | ArrayBuffer> {
    this.isLoadingSubject.next(true);
    const url = this.apiUrl + description;
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        switchMap(response => this.readFile(response)),
        finalize(() => this.isLoadingSubject.next(false))
    );
  }

  private readFile(blob: Blob): Observable<string | ArrayBuffer> {
    return new Observable(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }
}
