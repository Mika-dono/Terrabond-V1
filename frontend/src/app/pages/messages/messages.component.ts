import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  template: `<div><p>Messages Component</p></div>`,
  styles: []
})
export class MessagesComponent {}
