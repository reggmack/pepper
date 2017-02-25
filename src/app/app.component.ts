import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    displayName;
    photoURL;
    error;

    constructor(private af: AngularFire, private http: Http){    
    }

    ngOnInit() {
        this.af.auth.subscribe(authState => {
            authState.uid
        });
    }

    register() {  
        this.af.auth.createUser({
          email: 'ninja@reggmack.com',
          password: 'mygraphixguy'     
        })
        // .then(authState => console.log("REGISTER-THEN", authState))
        .then(authState => {
            authState.auth.sendEmailVerification();
            })
        .catch(error => this.error = error.message);
    }

    login() { 
        this.af.auth.login({
            email: 'ninja@reggmack.com',
            password: 'mygraphixguy'
        }, {
            method: AuthMethods.Password,
            provider: AuthProviders.Password
        })
        .then(authState => console.log("LOGIN-THEN", authState))
        .catch(error => console.log("LOGIN-ERROR", error));
        } 

    logout() {  
        this.af.auth.logout();
    }        
}
