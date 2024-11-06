import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../../models/common.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // console.log('ggwwwwww');

  // Check if the user is logged in
  if (!authService.isUserLoggedIn()) {
    // Redirect to login if not logged in
    router.navigate(['login']);
    return false;
  }

  // Get the required role from the route data
  const requiredRole = route.data['role'] as UserRole;
  // console.log('req4', requiredRole);

  // Get the user's role from the AuthService
  const userRole = authService.getUserRole();
  // console.log('begood');

  // Check if the user's role matches the required role
  if (userRole !== requiredRole) {
    // Redirect to unauthorized page or login if role does not match
    router.navigate(['login']); // Adjust this to redirect to an unauthorized page if needed
    return false;
  }
  // console.log('good');

  // Allow navigation if all checks pass
  return true;
};
