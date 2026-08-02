import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  /**
   * Load logged-in user's information
   */
  private loadUserInfo(): void {

    const firstName =
      this.tokenService.getFirstName() || '';

    const lastName =
      this.tokenService.getLastName() || '';

    this.userName =
      `${firstName} ${lastName}`.trim() || 'User';
  }

  /**
   * Logout
   */
  onLogout(): void {

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },

      error: () => {
        // AuthService clears local session even
        // when backend logout fails.
        this.router.navigate(['/login']);
      }
    });
  }
}