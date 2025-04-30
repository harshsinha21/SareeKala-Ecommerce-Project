import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);


  if (req.headers.get("No-Auth") === 'True') {
    return next(req);
  }

  const token = userAuthService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        userAuthService.clear();
        snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000 });
        router.navigate(['/login']);
      } else if (error.status === 403) {
        snackBar.open('Access denied.', 'Close', { duration: 3000 });
        router.navigate(['/forbidden']);
      }
      return throwError(() => new Error(`HTTP Error: ${error.status} - ${error.message}`));
    })
  );

 
};