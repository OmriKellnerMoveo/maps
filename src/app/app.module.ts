import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import {} from 'googlemaps';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import {FormsModule} from "@angular/forms";
import {AgmDirectionModule} from "agm-direction";
import { BottomDetailsComponent } from './component/bottom-details/bottom-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    BottomDetailsComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDrNNq8o872kGsxtu_oCi1QMvmvcdBKt7Q',
      libraries: ['places','geometry']
    }),
    FormsModule,
    AgmDirectionModule
    // GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
