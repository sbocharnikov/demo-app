import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {
  allowedKeys: string[] = ['Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Shift', 'Home', 'End'];
  notNumbers: RegExp = /[^0-9]/g;
  notLatinAndNumbers: RegExp = /[^0-9A-Za-z]/g;

  @Input() appRestrictInput: string = 'only-latin-and-numbers';

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (this.allowedKeys.indexOf(e.key) !== -1 ||
      (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'x' && (e.ctrlKey || e.metaKey))) {
      return;
    }
    if (this.appRestrictInput === 'only-numbers' && e.key.match(this.notNumbers)) {
        e.preventDefault();
    }

    if (this.appRestrictInput === 'only-latin-and-numbers' && e.key?.match(this.notLatinAndNumbers)) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    let pastedInput = event.clipboardData.getData('text/plain');

    if (this.appRestrictInput === 'only-numbers') {
      pastedInput = pastedInput.replace(this.notNumbers, '');
    }

    if (this.appRestrictInput === 'only-latin-and-numbers') {
      pastedInput = pastedInput.replace(this.notLatinAndNumbers, '');
    }

    document.execCommand('insertText', false, pastedInput);
  }
}
