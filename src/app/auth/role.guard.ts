import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/role.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

const allowedRoles: Role[] = route.data['roles'];
  const userRole = auth.getRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};