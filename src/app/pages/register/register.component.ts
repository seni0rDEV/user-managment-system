import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService); // Inject ToastrService

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      isAdmin: new FormControl(false), // new feature
      // mobile: new FormControl('', [Validators.required]),
      // dob: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: (response) => {
          this.toastr.success('Registration successful!');
          this.router.navigate(['admin']);
        },
        error: (err) => {
          this.toastr.error('user exists.');
          console.error(err);
        },
      });
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }
}
