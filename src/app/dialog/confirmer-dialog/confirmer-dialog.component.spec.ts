import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmerDialogComponent } from './confirmer-dialog.component';

describe('ConfirmerDialogComponent', () => {
  let component: ConfirmerDialogComponent;
  let fixture: ComponentFixture<ConfirmerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
