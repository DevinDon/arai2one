import { TestBed } from '@angular/core/testing';

import { Aria2Service } from './aria2.service';

describe('Aria2Service', () => {
  let service: Aria2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Aria2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
