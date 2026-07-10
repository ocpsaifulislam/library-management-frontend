import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent { 
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  };

  confirmPassword = ''; 
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit(formIsValid: boolean | null): void {
    if (!formIsValid || this.registerData.password !== this.confirmPassword) {
      this.toast.error('Please fix form validation errors before registering.');
      return;
    }

    this.isLoading = true;
 
    this.authService.register(this.registerData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // Check if status is 201 or success property is true
        if (response && (response.status === 201 || response.success === true)) {
          
          // 1. Show the dynamic success message directly from your API response
          this.toast.success(response.message || 'Registration successful!');
          
          // 2. Redirect back to login page
          this.router.navigate(['/login']);
          
        } else {
          // Handles explicit backend failure states disguised within a 200 OK handler
          const fallbackMsg = response.message || 'Registration failed.';
          this.toast.error(fallbackMsg);
        }
      },
      error: (err) => {
        this.isLoading = false;
        
        // Collects server validation errors or network infrastructure drop-outs
        const apiErrorMsg = err.error?.message || err.message || 'Registration encountered an error.';
        this.toast.error(apiErrorMsg);
      }
    });
  }
}