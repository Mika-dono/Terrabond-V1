import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<div><p>Profile Component</p></div>`,
  styles: []
})
export class ProfileComponent {}
