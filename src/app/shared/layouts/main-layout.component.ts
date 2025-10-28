import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <app-header></app-header>
      <div class="container mx-auto px-4 py-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class MainLayoutComponent { }