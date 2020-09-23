import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinComponent implements OnInit {
  pinForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  submitPinForm(): void {
  }

  private initializeForm(): void {
    this.pinForm = this.fb.group({
      pin: ['', Validators.required]
    });
  }
}
