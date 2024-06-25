import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueCheckoutsComponent } from './overdue-checkouts.component';

describe('OverdueCheckoutsComponent', () => {
  let component: OverdueCheckoutsComponent;
  let fixture: ComponentFixture<OverdueCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueCheckoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
