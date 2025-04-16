import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIfComponent } from './chat-if.component';

describe('ChatIfComponent', () => {
  let component: ChatIfComponent;
  let fixture: ComponentFixture<ChatIfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatIfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatIfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
