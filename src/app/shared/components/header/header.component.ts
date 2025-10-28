import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService, User } from '../../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    AvatarModule,
    MenuModule,
    ButtonModule
  ],
  template: `
    <div class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div class="container mx-auto">
        <p-menubar [model]="menuItems" [style]="{'background': 'transparent', 'border': 'none'}" styleClass="py-2">
          <ng-template pTemplate="start">
            <div class="flex items-center">
              <img src="logo3.jpg" alt="Logo" height="60" width="60" class="mr-3 rounded-full shadow-md border-2 border-white/20" />
              <span class="text-2xl font-bold text-white hidden md:block">Smart Library</span>
            </div>
          </ng-template>
          <ng-template pTemplate="end">
            <div class="flex items-center gap-3" *ngIf="currentUser$ | async as user">
              <button 
              [routerLink]="'/profile'" 
              class="flex items-center bg-white/10 rounded-full p-2 pr-4 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all focus:outline-none"
              role="link"
              aria-label="Go to Profile"
              >
                <p-avatar 
                [label]="user.name[0].toUpperCase()" 
                styleClass="mr-2"
                size="large"
                [style]="{'background-color': '#6366f1', 'color': '#ffffff', 'border': '2px solid rgba(255,255,255,0.2)'}"
                shape="circle"
                ></p-avatar>
                <div class="flex flex-col">
                <span class="font-medium text-white">{{ user.name }}</span>
                <span class="text-xs text-white/70">{{ user.role | titlecase }}</span>
                </div>
              </button>

              <p-button 
                icon="pi pi-power-off" 
                severity="danger"
                styleClass="p-button-rounded"
                (onClick)="logout()"
              ></p-button>
            </div>
          </ng-template>
        </p-menubar>
      </div>
    </div>
  `
})
export class HeaderComponent {
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