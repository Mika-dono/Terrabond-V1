import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div><p>Admin Dashboard Component</p></div>`,
  styles: []
})
export class DashboardComponent {}
