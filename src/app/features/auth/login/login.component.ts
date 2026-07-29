import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

import { LoginRequest } from '../../../core/models/login-request';
import { LoginResponse } from '../../../core/models/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.loginForm = this.createLoginForm();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
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

    const request: LoginRequest = {
      username: this.loginForm.value.username,

      password: this.loginForm.value.password,
    };

    this.authService.login(request).subscribe({
      next: (response: LoginResponse) => {
        if (response.success && response.body?.accessToken) {
          // Save JWT Access Token
          this.authService.saveToken(response.body.accessToken);

          // Save Refresh Token
          // এখানে AuthService এ method যোগ করলে ব্যবহার করবেন
          //
          // this.tokenService.setRefreshToken(
          //    response.body.refreshToken
          // );

          this.toast.success(response.message);

          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error(response.message || 'Login failed.');
        }
      },

      error: (error) => {
        const message =
          error?.error?.message || 'Invalid username or password.';

        this.toast.error(message);
      },

      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
