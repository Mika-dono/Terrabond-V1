import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  template: `<div><p>Content Component</p></div>`,
  styles: []
})
export class ContentComponent {}
