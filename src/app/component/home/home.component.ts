import { Component } from '@angular/core';
import { ChatAssistantComponent } from "../chat-assistant/chat-assistant.component";
import { ClaudeComponent } from "../claude/claude.component";

@Component({
  selector: 'app-home',
  imports: [ClaudeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
