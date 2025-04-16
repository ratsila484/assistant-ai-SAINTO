import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireDialogComponent } from './formulaire-dialog.component';

describe('FormulaireDialogComponent', () => {
  let component: FormulaireDialogComponent;
  let fixture: ComponentFixture<FormulaireDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
