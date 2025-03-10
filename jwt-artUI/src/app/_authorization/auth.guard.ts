import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { inject } from '@angular/core';
import { UserService } from '../_services/user.service';

export const authGuard: CanActivateFn = (route, state) => {

  const userAuthService = inject(UserAuthService);  // Inject UserAuthService
  const router = inject(Router);
  const userService = inject(UserService);

  if (userAuthService.getToken() !== null) {
    const role = route.data["roles"] as string[];
    if (role) {
      const match = userService.roleMatch(role);
      if (match) { return true; } else {
        router.navigate(['/forbidden']); return false;
      }
    }
  }
  router.navigate(['/login']);
  return false;

};
