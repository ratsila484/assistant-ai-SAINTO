import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaudeComponent } from './claude.component';

describe('ClaudeComponent', () => {
  let component: ClaudeComponent;
  let fixture: ComponentFixture<ClaudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
