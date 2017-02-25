import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'The Pepperiest!';
    cuisines: FirebaseListObservable<any[]>;
    restaurants: Observable<any[]>;
    exists;
  
    constructor(private af: AngularFire){ 
    }
    
    ngOnInit() {
        // /restaurants
        // /restaurants-by-city/camberwell

        this.af.database.list('/restaurants').push({ name: '' })
            .then(x => {
                // x.key

                let restaurant = { name: 'My New Restaurant' };

                let update = {};
                //update.firstName = '';
                update['restaurants/' + x.key] = { name: 'My New Restaurant' };
                update['restaurants-by-city/camberwell' + x.key] = { name: 'My New Restaurant' };

                this.af.database.object('/').update(update);
            });
    }
        
}
