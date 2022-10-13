import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MapService } from '../shared/map.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.component.html',
  styleUrls: ['./create-map.component.css'],
})
export class CreateMapComponent implements OnInit {
  public map: mapboxgl.Map;
  public startSelected: any;
  public endSelected: any;
  // public startPoint: MapboxGeocoder;
  // public endPoint: MapboxGeocoder;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private mapService: MapService,
    private http: HttpClient
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  ngOnInit(): void {
    this.map = this.mapService.initializeMap();
    // this.startPoint = this.mapService.getGeocoder('startPoint');
    // this.endPoint = this.mapService.getGeocoder('endPoint');

    this.map.on('style.load', () => {
      this.map.setFog({}); // Set the default atmosphere style
      this.map.resize();
    });
    // this.map.on('load', () => {
   
    //   document
    //     .getElementById('startPoint')!
    //     .replaceWith(this.startPoint.onAdd(this.map));
    //   document
    //     .getElementById('endPoint')!
    //     .replaceWith(this.endPoint.onAdd(this.map));
    // });
  }
}
