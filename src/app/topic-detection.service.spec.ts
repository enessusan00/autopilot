import { TestBed } from '@angular/core/testing';

import { TopicDetectionService } from './topic-detection.service';

describe('TopicDetectionService', () => {
  let service: TopicDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
