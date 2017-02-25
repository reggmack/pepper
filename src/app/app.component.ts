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

    constructor(private af: AngularFire, private http: Http){    
    }

    ngOnInit() {
        this.af.auth.subscribe(authState => {
            if (!authState) {
                // console.log("NOT LOGGED IN");
                this.displayName = null;
                this.photoURL = null;
                return;
            }
                
                // console.log("LOGGED IN", authState);

                let userRef = this.af.database.object('/users/' + authState.uid);
                userRef.subscribe(user => {
                    let url = `https://graph.facebook.com/v2.8/${authState.facebook.uid}?fields=first_name,last_name&access_token=${user.accessToken}`;
                    this.http.get(url).subscribe(response => {
                        let user = response.json();
                        userRef.update({
                            firstName: user.first_name,
                            lastName: user.last_name
                        });
                    });
                });
                
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
