import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, RouterLink],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.createLoginForm();
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],

      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.toast.error('Please enter valid credentials.');

      return;
    }

    this.isLoading = true;

    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username,

      password: this.loginForm.value.password,
    };

    this.authService
      .login(loginRequest)

      .subscribe({
        next: (response: any) => {
          this.isLoading = false;

          if (response?.token) {
            this.authService.saveToken(response.token);

            this.toast.success(response.message ?? 'Login successful!');

            this.router.navigate(['/dashboard']);
          } else {
            this.toast.error(response?.message ?? 'Login failed.');
          }
        },

        error: (err: any) => {
          this.isLoading = false;

          const message =
            err?.error?.message ?? 'Invalid username or password.';

          this.toast.error(message);
        },
      });
  }
}
