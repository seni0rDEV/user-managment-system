import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

import { catchError, EMPTY } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { UserRole } from '../../core/services/auth.service';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null;
  
  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required]],
  //   });

  // }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService // Inject ToastrService via constructor
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
      return
      ;
    }

    this.authService
      .login(this.form.value)
      
      .pipe(
        catchError((err) => {
          console.error(err)
          // alert(err.message);
          this.toastr.error(err.message, 'Login Error');
          return EMPTY;
        })
      )
      .subscribe({
        next: (response) => {
          this.toastr.success('Login successful!', 'Success');
          this.router.navigate(['']);
          // ***********************************
          
          //************************************
          console.log(response);
        },
      });
  }
}


