import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService, User } from '../../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    ButtonModule,
    TooltipModule
  ],
  template: `
    <div class="w-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-xl">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-3">
          <!-- Logo and Brand -->
          <div class="flex items-center gap-3">
            <img src="logo3.jpg" alt="Logo" height="60" width="60" class="rounded-full shadow-lg border-3 border-white/30 hover:scale-105 transition-transform" />
            <span class="text-2xl font-bold text-white hidden md:block drop-shadow-lg">Smart Library</span>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center gap-2">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-white/30 shadow-md"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
            >
              <i class="pi pi-home text-lg"></i>
              <span>Dashboard</span>
            </a>
            <a 
              routerLink="/books" 
              routerLinkActive="bg-white/30 shadow-md"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
            >
              <i class="pi pi-book text-lg"></i>
              <span>Books</span>
            </a>
            <a 
              *ngIf="auth.isAdmin()"
              routerLink="/av-communications" 
              routerLinkActive="bg-white/30 shadow-md"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
            >
              <i class="pi pi-video text-lg"></i>
              <span>AV-Communication</span>
            </a>
            <a 
              routerLink="/my-loans" 
              routerLinkActive="bg-white/30 shadow-md"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
            >
              <i class="pi pi-bookmark text-lg"></i>
              <span>My Loans</span>
            </a>
          </nav>

          <!-- User Profile & Actions -->
          <div class="flex items-center gap-3" *ngIf="currentUser$ | async as user">
            <button 
              [routerLink]="'/profile'" 
              class="flex items-center bg-white/15 rounded-full p-2 pr-4 backdrop-blur-md cursor-pointer hover:bg-white/25 transition-all shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              role="link"
              aria-label="Go to Profile"
            >
              <p-avatar 
                [label]="user.name[0].toUpperCase()" 
                styleClass="mr-2"
                size="large"
                [style]="{'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'color': '#ffffff', 'border': '2px solid rgba(255,255,255,0.3)', 'box-shadow': '0 4px 6px rgba(0,0,0,0.1)'}"
                shape="circle"
              ></p-avatar>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-white text-sm">{{ user.name }}</span>
                <span class="text-xs text-white/80">{{ user.role | titlecase }}</span>
              </div>
            </button>

            <p-button 
              icon="pi pi-power-off" 
              severity="danger"
              styleClass="p-button-rounded shadow-lg"
              [style]="{'background': 'rgba(239, 68, 68, 0.9)', 'border': 'none'}"
              (onClick)="logout()"
              pTooltip="Logout"
              tooltipPosition="bottom"
            ></p-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {
  protected auth = inject(AuthService);
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
      styleClass: 'text-white hover:text-white/90'
    },
    {
      label: 'Books',
      icon: 'pi pi-book',
      routerLink: '/books',
      styleClass: 'text-white hover:text-white/90'
    },
    {
      label: 'My Loans',
      icon: 'pi pi-bookmark',
      routerLink: '/my-loans',
      styleClass: 'text-white hover:text-white/90'
    }
  ];

  currentUser$;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.user$;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}