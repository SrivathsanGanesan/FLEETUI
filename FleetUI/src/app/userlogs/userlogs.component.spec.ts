import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlogsComponent } from './userlogs.component';

describe('UserlogsComponent', () => {
  let component: UserlogsComponent;
  let fixture: ComponentFixture<UserlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
