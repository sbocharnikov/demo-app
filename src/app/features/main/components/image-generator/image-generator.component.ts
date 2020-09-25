import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGeneratorComponent {}
