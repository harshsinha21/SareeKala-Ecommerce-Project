import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { UserAuthService } from "../_services/user-auth.service";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";

export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private userAuthService: UserAuthService,
        private router: Router
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get("No-Auth") === 'True') {
            return next.handle(req.clone());
        }

        // Get the token
        const token = this.userAuthService.getToken();

        // If the token exists, add it to the request
        if (token) {
            console.log('Adding token to request ', token);
            req = this.addToken(req, token);
            console.log('Request with token: ', req);
        } else {
            console.log('No token found.');
        }

        // Handle the request and intercept errors
        return next.handle(req).pipe(
            catchError(
                (error: HttpErrorResponse) => {
                    console.log(error.status);
                    console.log('HTTP Error response:', error);
                    if (error.status === 401) {
                        // Navigate to login page if the user is unauthorized
                        this.router.navigate(['/login']);
                    }
                    if (error.status === 403) {
                        // Navigate to forbidden page if the user doesn't have permission
                        this.router.navigate(['/forbidden']);
                    }
                    // Return the error if other errors occur
                    return throwError(() => new Error('Something is not working...'));
                }
            )
        );

    }

    private addToken(request: HttpRequest<any>, token: string) {
        console.log('Adding token to request headers');
        return request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }
}