import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRemoveBookComponent } from './edit-remove-book.component';

describe('EditRemoveBookComponent', () => {
  let component: EditRemoveBookComponent;
  let fixture: ComponentFixture<EditRemoveBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRemoveBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRemoveBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
