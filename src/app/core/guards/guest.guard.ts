import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService } from '../services/token.service';

export const guestGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // User already logged in
  if (tokenService.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }

  // User not logged in
  return true;
};
