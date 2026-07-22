import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      
      this.toast.error('Please enter valid credentials.');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        
        if (res && (res.token || res.success)) {
          this.authService.saveToken(res.token);
          
          // 1. Trigger green success toast
          this.toast.success(res.message || 'Login successful!');
          
          // 2. Brief 800ms delay so user can see green toast before route changes
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 800);

        } else {
          this.toast.error(res?.message || 'Login failed.');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        
        // Trigger red error toast
        const errorMsg = err.error?.message || 'Invalid username or password.';
        this.toast.error(errorMsg);
      }
    });
  }
}