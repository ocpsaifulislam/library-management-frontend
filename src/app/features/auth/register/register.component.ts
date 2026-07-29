import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

import { RegisterRequest } from '../../../core/models/register-request';
import { RegisterResponse } from '../../../core/models/register-response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.createRegisterForm();
  }

  private createRegisterForm(): FormGroup {
    return this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4)]],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator(),
      }
    );
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.error('Please fix the validation errors.');
      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.value;

    const requestData: RegisterRequest = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      username: formValue.username!,
      email: formValue.email!,
      phoneNumber: formValue.phoneNumber!,
      password: formValue.password!,
    };

    this.authService.register(requestData).subscribe({
      next: (response: RegisterResponse) => {
        if (response.success) {
          this.toast.success(response.message || 'Registration successful.');
          this.router.navigate(['/login']);
        } else {
          this.toast.error(response.message || 'Registration failed.');
        }
      },

      error: (error) => {
        const message =
          error?.error?.message ||
          error?.message ||
          'An unexpected error occurred.';

        this.toast.error(message);
      },

      complete: () => {
        this.isLoading = false;
      },
    });
  }
}