import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
import { PinResponseInterface } from '../../models/pinResponse.interface';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinComponent implements OnInit, OnDestroy {
  pinForm: FormGroup;
  isSubmitting: boolean = false;
  private isPinFailedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isDestroyed: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  get pin(): FormControl {
    return this.pinForm.get('pin') as FormControl;
  }

  get isPinFailed(): Observable<boolean> {
    return this.isPinFailedSubject.asObservable();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
    this.isDestroyed.complete();
  }

  submitPinForm(): void {
    if (this.pinForm.valid) {
      this.isSubmitting = true;
      this.authService.confirmPin(this.pinForm.value).pipe(
        take(1),
        catchError(this.handleConfirmPinError),
        finalize(() => this.isSubmitting = false)
      ).subscribe();
    }
  }

  private initializeForm(): void {
    this.pinForm = this.fb.group({
      pin: ['', {
        validators: [Validators.required, Validators.minLength(4)],
      }]
    });
  }

  private initializeSubscriptions(): void {
    this.pin.valueChanges.pipe(
      filter(value => value?.length),
      tap(() => this.isPinFailedSubject.next(false)),
      takeUntil(this.isDestroyed)
    ).subscribe();
  }

  private handleConfirmPinError = (error: PinResponseInterface): Observable<never> => {
    if (error.status === 'Error') {
      this.isPinFailedSubject.next(true);
      this.pinForm.reset();
    }
    return EMPTY;
  }
}
