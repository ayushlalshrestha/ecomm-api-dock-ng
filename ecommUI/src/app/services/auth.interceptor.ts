import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    // constructor(private tokenExtractor: HttpXsrfTokenExtractor) { }
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("jwt_token");
        
        if (idToken) {
            const newHeader = {headers: req.headers.set("Authorization", "Token " + idToken)}
            const cloned = req.clone(newHeader);
            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}

