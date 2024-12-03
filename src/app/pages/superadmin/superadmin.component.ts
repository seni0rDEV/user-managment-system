import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../models/common.model'; // Update the path as needed
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule],
  templateUrl: './superadmin.component.html',
  styleUrl: './superadmin.component.scss',
})
export class SuperadminComponent implements OnInit {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  logout() {
    // console.log('hey')
    this.authService.logout();
  }
  users: User[] = [];
  selectedUserId: string | null = null;
  selectedRole: 'user' | 'admin' | 'superadmin' | null = null;
  errorMessage: string = '';

  // Pagination properties
  totalUsers: number = 0; // Total number of users (from backend)
  pageSize: number = 10; // Default page size
  currentPage: number = 0; // Default page number

  // constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  // Fetch all users using AuthService
  fetchAllUsers(page: number = 0, size: number = 10): void {
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

  // Change the page and reload data
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchAllUsers(this.currentPage, this.pageSize);
  }
  // Change the selected user's role
  onChangeRole(): void {
    if (this.selectedUserId && this.selectedRole) {
      this.authService
        .updateUserRole(this.selectedUserId, this.selectedRole)

        .subscribe({
          next: (response: ApiResponse<User>) => {
            if (response.status) {
              // this.toastr
              this.toastr.success('Role changed!', 'Success');
              this.fetchAllUsers(); // Refresh the list after updating the role
              this.errorMessage = ''; // Clear any previous errors
            } else {
              this.errorMessage = 'Failed to update user role';
              this.toastr.success('Role change failed!', 'failed');
            }
          },
          error: (error) => {
            this.errorMessage = error.message;
          },
        });
    }
  }
}
