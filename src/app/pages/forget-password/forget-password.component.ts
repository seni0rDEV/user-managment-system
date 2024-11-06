import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService
      .forgotPassword(this.form.value.email)
      .pipe(
        catchError((err) => {
          console.error(err);
          this.toastr.error(err.message, 'Forgot Password Error');
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastr.success(
            'Password reset email sent successfully!',
            'Success'
          );
          this.router.navigate(['/login']);
        },
      });
  }
}
