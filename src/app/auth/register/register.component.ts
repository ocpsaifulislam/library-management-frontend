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

import { AuthService } from '../../core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.createRegisterForm();
  }

  private createRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],

        lastName: ['', [Validators.required]],

        username: ['', [Validators.required, Validators.minLength(4)]],

        phoneNumber: ['', [Validators.required]],

        email: ['', [Validators.required, Validators.email]],

        password: ['', [Validators.required, Validators.minLength(6)]],

        confirmPassword: ['', [Validators.required]],
      },

      {
        validators: this.passwordMatchValidator(),
      },
    );
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;

      const confirmPassword = control.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        return {
          passwordMismatch: true,
        };
      }

      return null;
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      this.toast.error('Please fix validation errors.');

      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.getRawValue();

    const requestData: RegisterRequest = {
      firstName: formValue.firstName,

      lastName: formValue.lastName,

      username: formValue.username,

      email: formValue.email,

      phoneNumber: formValue.phoneNumber,

      password: formValue.password,
    };

    this.authService.register(requestData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response?.success === true || response?.status === 201) {
          this.toast.success(response.message ?? 'Registration successful!');

          this.router.navigate(['/login']);
        } else {
          this.toast.error(response.message ?? 'Registration failed');
        }
      },

      error: (err) => {
        this.isLoading = false;

        this.toast.error(err.error?.message ?? 'Server error occurred');
      },
    });
  }
}
