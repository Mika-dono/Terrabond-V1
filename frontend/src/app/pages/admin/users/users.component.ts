import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `<div><p>Users Component</p></div>`,
  styles: []
})
export class UsersComponent {}
