import { Directive, HostListener, Input } from '@angular/core';
import { allowedKeys } from '../../app.config';

@Directive({
  selector: '[appMaxLength]'
})
export class MaxLengthDirective {

  @Input() appMaxLength: string = '4';

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (allowedKeys.indexOf(e.key) !== -1 ||
      (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'x' && (e.ctrlKey || e.metaKey))) {
      return;
    }

    if (value?.length >= +this.appMaxLength) {
      e.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(e: KeyboardEvent): void {
    const target = e.target as HTMLInputElement;

    if (target.value.length >= +this.appMaxLength) {
      target.value = target.value.slice(0, +this.appMaxLength);
    }
  }
}
