import { Component, inject, OnInit } from '@angular/core';
import { ModelComponent } from '../shared/ui/model/model.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../models/Employee';
// import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ModelComponent, EmployeeFormComponent, CommonModule, NgIf],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  authService = inject(AuthService);

  logout() {
    // console.log('hey')
    this.authService.logout();
  }

  isModelOpen = false;
  employees: IEmployee[] = [];
  employee!: IEmployee;

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.employeeService.getAllEmployee().subscribe({
      next: (response) => {
        if (response.data) {
          this.employees = response.data;
        }
      },
    });
  }

  loadEmployee(employee: IEmployee) {
    this.employee = employee;
    this.openModel();
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.getAllEmployee();
      },
    });
  }

  openModel() {
    this.isModelOpen = true;
  }

  closeModel() {
    this.isModelOpen = false;
    this.getAllEmployee();
  }

  verifyUser(userId: string | undefined) {
    console.log('User ID received:', userId); 
     if (typeof userId !== 'string') {
       console.error('Invalid user ID:', userId);
       return;
     }

    this.authService.verifyUser(userId).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('verification email sent sucessfully!','Sucess');
          // const user = this.employees.find((emp) => emp._id === userId);
          // if (user) user.verified = true; // Update the local state
        }
      },
      error: (err) => {
        console.error('Verification failed', err);
         this.toastr.success('verification failed!', 'Failed');
      },
    });
  }

  // verifyUser(token: string) {
  //   if (!token) {
  //     console.error('No resetPasswordToken available');
  //     return;
  //   }

  //   this.authService.verifyUser(token).subscribe({
  //     next: (response) => {
  //       if (response.status) {
  //         // Update local employee state upon successful verification
  //         const user = this.employees.find((emp) => emp.resetPasswordToken === token);
  //         if (user) user.verified = true;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Verification failed', err);
  //     },
  //   });
  // }
  
}
