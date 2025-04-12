import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDevisComponent } from './dialog-devis.component';

describe('DialogDevisComponent', () => {
  let component: DialogDevisComponent;
  let fixture: ComponentFixture<DialogDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDevisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
