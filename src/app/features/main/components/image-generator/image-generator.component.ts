import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.scss'],
  providers: [ImageGeneratorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGeneratorComponent implements OnInit {
  searchForm: FormGroup;
  isLoading: Observable<boolean> = this.generatorService.isLoading;
  private imageAltSubject: Subject<string> = new Subject<string>();
  private imageSubject: BehaviorSubject<string | ArrayBuffer> = new BehaviorSubject<string | ArrayBuffer>(null);

  constructor(private fb: FormBuilder, private generatorService: ImageGeneratorService) {
  }

  get description(): FormControl {
    return this.searchForm.get('description') as FormControl;
  }

  get imageAlt(): Observable<string> {
    return this.imageAltSubject.asObservable();
  }

  get image(): Observable<string | ArrayBuffer> {
    return this.imageSubject.asObservable();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  generate(): void {
    this.generatorService.generate(this.description.value).pipe(
      tap((response) => this.handleResponse(response))
    ).subscribe();
  }

  private handleResponse(response: string | ArrayBuffer): void {
    this.imageSubject.next(response);
    this.imageAltSubject.next(this.description.value);
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({ description: '' });
  }
}
