import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotChartComponent } from './robot-chart.component';

describe('RobotChartComponent', () => {
  let component: RobotChartComponent;
  let fixture: ComponentFixture<RobotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RobotChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
