import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../models/common.model'; // Update the path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './superadmin.component.html',
  styleUrl: './superadmin.component.scss',
})
export class SuperadminComponent implements OnInit {
  authService = inject(AuthService);

  logout() {
    // console.log('hey')
    this.authService.logout();
  }
  users: User[] = [];
  selectedUserId: string | null = null;
  selectedRole: 'user' | 'admin' | 'superadmin' | null = null;
  errorMessage: string = '';

  // constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  // Fetch all users using AuthService
  fetchAllUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (response: ApiResponse<User[]>) => {
        if (response.status) {
          this.users = response.data;
        } else {
          this.errorMessage = 'Failed to fetch users';
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  // Change the selected user's role
  onChangeRole(): void {
    if (this.selectedUserId && this.selectedRole) {
      this.authService
        .updateUserRole(this.selectedUserId, this.selectedRole)
        .subscribe({
          next: (response: ApiResponse<User>) => {
            if (response.status) {
              this.fetchAllUsers(); // Refresh the list after updating the role
              this.errorMessage = ''; // Clear any previous errors
            } else {
              this.errorMessage = 'Failed to update user role';
            }
          },
          error: (error) => {
            this.errorMessage = error.message;
          },
        });
    }
  }
}
