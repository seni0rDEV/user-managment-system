import { Component, inject, OnInit } from '@angular/core';
import { ModelComponent } from '../shared/ui/model/model.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { IEmployee } from '../shared/models/Employee';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ModelComponent, EmployeeFormComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  
   authService = inject(AuthService)

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

}
