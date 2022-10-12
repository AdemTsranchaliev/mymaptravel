import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMapComponent } from './create-map/create-map.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ChooseLocationPlaneComponent } from './create-map/choose-location-plane/choose-location-plane.component';
import { ChooseLocationCarComponent } from './create-map/choose-location-car/choose-location-car.component';
import { ChooseViewComponent } from './create-map/choose-view/choose-view.component';
import { MapService } from './shared/map.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateMapComponent,
    HomeComponent,
    ChooseLocationPlaneComponent,
    ChooseLocationCarComponent,
    ChooseViewComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule

  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
