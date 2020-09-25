import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { JobSearchService } from '../../services/job-search.service';
import { Observable, Subject } from 'rxjs';
import { JobInterface } from '../../types/job.interface';
import { takeUntil, tap } from 'rxjs/operators';
import { initialCount } from '../../../../app.config';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [JobSearchService]
})
export class JobSearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  jobs: Observable<JobInterface[]> = this.searchService.jobs;
  isAllJobsLoaded: Observable<boolean> = this.searchService.isAllJobsLoaded;
  isJobNotFound: Observable<boolean> = this.searchService.isJobNotFound;
  private isLoadMoreClicked: boolean = false;
  private isSearchClicked: boolean = false;
  private isDestroyed: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private searchService: JobSearchService) {
  }

  get description(): FormControl {
    return this.searchForm.get('description') as FormControl;
  }

  get perPageCount(): FormControl {
    return this.searchForm.get('perPageCount') as FormControl;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
    this.isDestroyed.complete();
  }

  search(): void {
    this.isSearchClicked = true;
    this.searchService.search(this.description.value);
  }

  trackById(index: number, job: JobInterface): string {
    return job.id;
  }

  loadMore(): void {
    this.isLoadMoreClicked = true;
    this.searchService.loadMore();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      description: '',
      perPageCount: initialCount
    });
  }

  private initializeSubscriptions(): void {
    this.jobs.pipe(
      tap(() => this.isNeedToScrollToTop()),
      takeUntil(this.isDestroyed)
    ).subscribe();
    this.perPageCount.valueChanges.pipe(
      tap((count) => this.onPerPageChange(count)),
      takeUntil(this.isDestroyed)
    ).subscribe();
  }

  private isNeedToScrollToTop(): void {
    if (this.isLoadMoreClicked) {
      this.scrollToTop();
      this.isLoadMoreClicked = false;
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private onPerPageChange(count: string): void {
    this.searchService.setPerPageCount(count);
    if (this.isSearchClicked) {
      this.search();
    }
  }
}
