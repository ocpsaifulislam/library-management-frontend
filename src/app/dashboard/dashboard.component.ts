import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule for Template-driven forms
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Operating as a clean modern standalone shell
  imports: [
    CommonModule, 
    FormsModule,       // 2. Makes NgForm and ngModel accessible in the template
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}