import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { catchError, finalize, take } from 'rxjs/operators';
import { PinResponseInterface } from '../../models/pinResponse.interface';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinComponent implements OnInit {
  pinForm: FormGroup;
  isSubmitting: boolean = false;
  private isPinFailedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
  }

  get pin(): FormControl {
    return this.pinForm.get('pin') as FormControl;
  }

  get isPinInvalid(): boolean {
    return this.pin.invalid && this.pin.dirty;
  }

  get isPinFailed(): Observable<boolean> {
    return this.isPinFailedSubject.asObservable();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  submitPinForm(): void {
    this.pin.markAsDirty();
    this.isPinFailedSubject.next(false);
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
        updateOn: 'blur'
      }]
    }, { updateOn: 'submit' });
  }

  private handleConfirmPinError = (error: PinResponseInterface): Observable<never> => {
    if (error.status === 'Error') {
      this.isPinFailedSubject.next(true);
      this.pinForm.reset();
    }
    return EMPTY;
  }
}
