import { TestBed } from '@angular/core/testing';

import { PinGuard } from './pin.guard';

describe('PinGuard', () => {
  let guard: PinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
