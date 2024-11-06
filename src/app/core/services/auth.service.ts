import { HttpClient } from '@angular/common/http';

// import { apiUrl } from '../constants/constants';
import { Injectable, inject, signal } from '@angular/core';
import {
  LoginPayload,
  ApiResponse,
  User,
  RegisterPayload,
} from '../../models/common.model';
import { ApiEndpoint, LocalStorage } from '../constants/constants';
import { catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
export type UserRole = 'user' | 'superadmin' | 'admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  userRole = signal<UserRole | null>(null);
  router = inject(Router);

  constructor(private _http: HttpClient) {
    // Initialize isLoggedIn based on the presence of a user token
    if (this.getUserToken()) {
      this.isLoggedIn.update(() => true);
      this.userRole.update(() => this.getUserRole()); // Set user role from local storage
    }
  }

  // Register a new user
  register(payload: RegisterPayload) {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Log in a user and store the token and role
  login(payload: LoginPayload) {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, payload)
      .pipe(
        map((response) => {
          if (response.status && response.token) {
            localStorage.setItem(LocalStorage.token, response.token);
            localStorage.setItem(LocalStorage.role, response.data.role);
            this.userRole.update(() => response.data.role);
            this.isLoggedIn.update(() => true);
          }
          return response;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  // Get the user role from local storage
  getUserRole(): UserRole | null {
    return localStorage.getItem(LocalStorage.role) as UserRole | null;
  }

  // Check if the user is logged in
  isUserLoggedIn(): boolean {
    return this.isLoggedIn(); // Return the signal value
  }

  // Fetch user details
  me() {
    return this._http.get<ApiResponse<User>>(`${ApiEndpoint.Auth.Me}`);
  }

  // Get the user token from local storage
  getUserToken() {
    return localStorage.getItem(LocalStorage.token);
  }

  forgotPassword(email: string) {
    return this._http
      .post(`${ApiEndpoint.forgotPassword.recover}`, { email })
      .pipe(catchError((error) => this.handleError(error)));
  }

  //..............................................................................
  // Fetch all users (only for superadmin or admin)
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this._http
      .get<ApiResponse<User[]>>(`${ApiEndpoint.User.All}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Update user role (for superadmin or admin)
  updateUserRole(
    userId: string,
    role: UserRole
  ): Observable<ApiResponse<User>> {
    return this._http
      .put<ApiResponse<User>>(`${ApiEndpoint.User.All}/${userId}/role`, {
        role,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }
  //.....................................................................

  // Log out the user and remove the token & role
  logout() {
    localStorage.removeItem(LocalStorage.role);
    localStorage.removeItem(LocalStorage.token);
    this.isLoggedIn.update(() => false);
    this.userRole.update(() => null); // Reset user role on logout
    this.router.navigate(['login']);
  }

  // resetpassword method
  // resetPassword(token: string, newPassword: string) {
  //   return this._http
  //     .post(`${ApiEndpoint.ConfirmPassword.Resetpassword}`, {
  //       token,
  //       newPassword,
  //     })
  //     .pipe(catchError((error) => this.handleError(error)));
  // }

  resetPassword(token: string, newPassword: string) {
    return this._http
      .post(`${ApiEndpoint.ConfirmPassword.Resetpassword}/${token}`, {
        password: newPassword,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Handle HTTP errors
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error) {
      errorMessage = error.error.error ?? errorMessage;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
