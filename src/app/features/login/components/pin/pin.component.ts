import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor(private fb: FormBuilder) {
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
    if (this.pinForm.valid) {}
  }

  private initializeForm(): void {
    this.pinForm = this.fb.group({
      pin: ['', {
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: 'blur'
      }]
    });
  }
}
