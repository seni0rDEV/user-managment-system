import { Component, Inject, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
})
export default class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  activatedRoute = Inject(ActivatedRoute)
  router = inject(Router)
  passwordsMismatch = false;
  token!: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    // Subscribe to value changes to check for password mismatch
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  ngOnInit() {
    // Capture the token from the URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  // Function to check if passwords match
  checkPasswords() {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    this.passwordsMismatch = password !== confirmPassword;
  }

  onSubmit() {
    if (this.form.invalid || this.passwordsMismatch) {
      this.form.markAllAsTouched();
      return;
    }

    const { password } = this.form.value; // Extract only the new password

    // Call your service to reset the password
    this.authService
      .resetPassword(this.token, password) // Pass token and password to backend
      .pipe(
        catchError((err) => {
          console.error(err);
          this.toastr.error(err.message, 'Error');
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.toastr.success('Password reset successful!', 'Success');
        },
      });
  }
}
