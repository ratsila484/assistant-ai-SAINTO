import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProduitsComponent } from './all-produits.component';

describe('AllProduitsComponent', () => {
  let component: AllProduitsComponent;
  let fixture: ComponentFixture<AllProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProduitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
