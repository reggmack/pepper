import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
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

    constructor(private af: AngularFire){    
    }

    ngOnInit() {
        this.af.auth.subscribe(authState => {
            if (!authState) {
                // console.log("NOT LOGGED IN");
                this.displayName = null;
                this.photoURL = null;
                return;
            }
                console.log("LOGGED IN", authState);
                this.displayName = authState.auth.displayName;
                this.photoURL = authState.auth.photoURL;
        });
    }

    login() {    
        this.af.auth.login({
            provider: AuthProviders.Facebook,
            method:AuthMethods.Popup,
            scope: ['public_profile', 'user_friends']
        }).then((authState: any) => {
            // console.log("AFTER LOGIN", authState);
            this.af.database.object('/users/' + authState.uid).update({
                accessToken: authState.facebook.accessToken
            })
        });
    }

    logout() {
        this.af.auth.logout();      
    }        
}
