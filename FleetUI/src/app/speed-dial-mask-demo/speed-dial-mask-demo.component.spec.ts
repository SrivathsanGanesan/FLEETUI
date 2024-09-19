import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDialMaskDemoComponent } from './speed-dial-mask-demo.component';

describe('SpeedDialMaskDemoComponent', () => {
  let component: SpeedDialMaskDemoComponent;
  let fixture: ComponentFixture<SpeedDialMaskDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedDialMaskDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedDialMaskDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
