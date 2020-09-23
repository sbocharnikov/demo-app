import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {
  allowedKeys: string[] = ['Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Shift', 'Home', 'End'];
  notNumbers: RegExp = /[^0-9]/g;

  @Input() appRestrictInput: string = 'only-latin-and-numbers';

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (this.appRestrictInput === 'only-numbers') {
      if (this.allowedKeys.indexOf(e.key) !== -1 ||
        (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'x' && (e.ctrlKey || e.metaKey))) {
        return;
      }
      if (e.key.match(this.notNumbers)) {
        e.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(this.notNumbers, '');
    document.execCommand('insertText', false, pastedInput);
  }
}
