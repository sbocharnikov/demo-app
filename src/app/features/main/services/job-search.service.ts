import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { JobInterface } from '../types/job.interface';
import { JobQueryParams } from '../types/query-params.interface';
import { initialCount } from '../../../app.config';

@Injectable()
export class JobSearchService {
  private foundJobs: JobInterface[] = [];
  private perPageCount: number = initialCount;
  private pageForView: number = 1;
  private isLoadingSubject: Subject<boolean> = new Subject<boolean>();
  private queryParams: JobQueryParams = {};
  private jobsSubject: BehaviorSubject<JobInterface[]> = new BehaviorSubject<JobInterface[]>([]);
  private isAllJobsLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isJobNotFoundSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl: string = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

  constructor(private http: HttpClient) { }

  get jobs(): Observable<JobInterface[]> {
    return this.jobsSubject.asObservable();
  }

  get isAllJobsLoaded(): Observable<boolean> {
    return this.isAllJobsLoadedSubject.asObservable();
  }

  get isJobNotFound(): Observable<boolean> {
    return this.isJobNotFoundSubject.asObservable();
  }

  get isLoading(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  search(description: string): void {
    this.queryParams.description = description;
    this.queryParams.page = 1;
    this.pageForView = 1;
    this.isAllJobsLoadedSubject.next(false);
    this.isJobNotFoundSubject.next(false);
    this.requestJobs().subscribe();
  }

  loadMore(): void {
    if (this.foundJobs.length > this.perPageCount * this.pageForView) {
      this.pageForView++;
      this.prepareJobsForView();
    } else {
      this.queryParams.page++;
      this.pageForView = 1;
      this.requestJobs().subscribe();
    }
  }

  setPerPageCount(count: string): void {
    this.perPageCount = +count;
  }

  private requestJobs(): Observable<JobInterface[]> {
    this.isLoadingSubject.next(true);
    const params = this.queryParams as HttpParams;
    return this.http.get<JobInterface[]>(this.apiUrl, { params }).pipe(
      tap((response) => this.handleSearchResponse(response)),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  private handleSearchResponse(response: JobInterface[]): void {
    this.foundJobs = response;
    this.jobsSubject.next(response);
    this.prepareJobsForView();

    if (this.queryParams.page === 1 && response.length === 0) {
      this.isJobNotFoundSubject.next(true);
    }

    if (this.queryParams.page > 1 && response.length === 0) {
      this.isAllJobsLoadedSubject.next(true);
    }
  }

  private prepareJobsForView(): void {
    const start = this.perPageCount * (this.pageForView - 1);
    const end = this.perPageCount * this.pageForView;
    const jobs = this.foundJobs.slice(start, end);

    if (jobs.length) {
      this.jobsSubject.next(jobs);
    }

    if (jobs.length % this.perPageCount !== 0) {
      this.isAllJobsLoadedSubject.next(true);
    }
  }
}
