import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisMadamaComponent } from './devis-madama.component';

describe('DevisMadamaComponent', () => {
  let component: DevisMadamaComponent;
  let fixture: ComponentFixture<DevisMadamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisMadamaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisMadamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
