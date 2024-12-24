import { TestBed } from '@angular/core/testing';

import { HeatmapServiceService } from './heatmap-service.service';

describe('HeatmapServiceService', () => {
  let service: HeatmapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
