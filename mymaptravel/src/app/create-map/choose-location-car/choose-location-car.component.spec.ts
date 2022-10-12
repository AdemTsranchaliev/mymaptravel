import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLocationCarComponent } from './choose-location-car.component';

describe('ChooseLocationCarComponent', () => {
  let component: ChooseLocationCarComponent;
  let fixture: ComponentFixture<ChooseLocationCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseLocationCarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLocationCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
