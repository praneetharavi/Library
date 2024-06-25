import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestCheckoutsComponent } from './latest-checkouts.component';

describe('LatestCheckoutsComponent', () => {
  let component: LatestCheckoutsComponent;
  let fixture: ComponentFixture<LatestCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestCheckoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
