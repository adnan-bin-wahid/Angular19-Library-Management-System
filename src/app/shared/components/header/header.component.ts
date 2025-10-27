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
    <div class="w-full shadow-md bg-white">
      <p-menubar [model]="menuItems" class="border-none">
        <ng-template pTemplate="start">
          <div class="flex items-center">
            <img src="logo3.jpg" alt="Logo" height="60" width="60" class="mr-2" />
            <!-- <span class="text-xl font-bold">Smart Library</span> -->
          </div>
        </ng-template>
        <ng-template pTemplate="end">
          <div class="flex items-center gap-2" *ngIf="currentUser$ | async as user">
            <p-avatar 
              [label]="user.name[0].toUpperCase()" 
              styleClass="mr-2"
              [style]="{'background-color': '#4f46e5', 'color': '#ffffff'}"
            ></p-avatar>
            <span class="font-medium mr-2">{{ user.name }}</span>
            <p-button 
              icon="pi pi-user" 
              severity="secondary"
              styleClass="mr-2"
              routerLink="/profile"
            ></p-button>
            <p-button 
              icon="pi pi-power-off" 
              severity="danger"
              (onClick)="logout()"
            ></p-button>
          </div>
        </ng-template>
      </p-menubar>
    </div>
  `
})
export class HeaderComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Books',
      icon: 'pi pi-book',
      routerLink: '/books'
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