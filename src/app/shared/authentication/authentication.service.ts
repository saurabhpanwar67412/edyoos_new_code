import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../../model/login/user.model';
import { PlacesService } from '../places.service';
import { apiRoutes } from '../routes/apiroutes';

declare var FB: any;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private placesService: PlacesService,
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('edyoosUserDetails')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    setUserValue(user: User) {
        localStorage.setItem('edyoosUserDetails', JSON.stringify(user));
        this.userSubject.next(user);
    }

    isAuthorized() {
        return !!this.userValue;
    }

    // externalFacebookLogin(token: string) {
    //     let params = {
    //         accessToken: token
    //     }
    //     return this.http.post(apiRoutes.login.externalFacebookLogin, params);
    // }

    // appleExternalLogin(appleRequest: any) {

    //     return this.http.post(apiRoutes.login.appleExternalLogin, appleRequest);
    // }

    // externalGoogleLogin(params: any) {

    //     return this.http.post(apiRoutes.login.externalGoogleLogin, params);
    // }

    getUserDetailsFromUrl() {

        let accessToken = this.getAccessToken("access_token");
        let username = this.getAccessToken("username");
        let user = new User();
        user.username = username;
        user.access_token = accessToken;
        user.email = this.getAccessToken("email");
        //user.firstName = this.getAccessToken("firstName");
        user.role = this.getAccessToken("role");
        user.id = +this.getAccessToken("Id");

        if (accessToken) {
            this.setUserValue(user);
        }

    }
    getAccessToken(name): string {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);

        return (results !== null) ? results[1] : null;
    }

    // login(username: string, password: string) {
    //     return this.http.post<any>(`${environment.apiURL}/users/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
    //             user.authdata = window.btoa(username + ':' + password);
    //             localStorage.setItem('user', JSON.stringify(user));
    //             this.userSubject.next(user);
    //             return user;
    //         }));
    // }

    logout() {

        // this.placesService.cartPropertyGroup = [];

        // localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

        // this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);

        // remove user from local storage to log user out
        localStorage.removeItem('edyoosUserDetails');
        this.userSubject.next(null);
        this.router.navigate(['landing']);
    }
}