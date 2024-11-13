import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService, UserRole } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, NgClass],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isMenuOpen = false;
  showForgotPasswordLink = false;
  showResetPasswordLink = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private router: Router) {}
  ngOnInit() {
    this.showResetPasswordLink = this.router.url.startsWith('/resetpassword');

    this.router.events.subscribe((event) => {
      console.log(event);

      if (event instanceof NavigationEnd) {
        console.log('Navigated to URL:', event.urlAfterRedirects);

        // Check if the current route is the "Forget Password"
        this.showForgotPasswordLink =
          event.urlAfterRedirects === '/forgetpassword';
        // Check if the current route is the "reset Password"
        this.showResetPasswordLink =
          event.urlAfterRedirects.startsWith('/resetpassword');

        console.log('showForgotPasswordLink:', this.showForgotPasswordLink);
        console.log('showResetPasswordLink:', this.showResetPasswordLink);
      } else {
        console.log('Router event did not trigger NavigationEnd:', event);
      }
    });
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;
  isRole(role: UserRole) {
    return this.authService.userRole() === role;
  }
}
