import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageRatingComponent } from './average-rating.component';

describe('AverageRatingComponent', () => {
  let component: AverageRatingComponent;
  let fixture: ComponentFixture<AverageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
