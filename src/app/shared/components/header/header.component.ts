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
  templateUrl: './header.component.html'
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