import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MapService } from '../shared/map.service';
import { HttpClient } from '@angular/common/http';
declare var $:any;

@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.component.html',
  styleUrls: ['./create-map.component.css'],
})
export class CreateMapComponent implements OnInit {
  public map: mapboxgl.Map;
  public startSelected: any;
  public endSelected: any;
  public innerWidth: number;
  public align: number = 1;
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.innerWidth = window.innerWidth;
  }

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
    this.innerWidth = window.innerWidth;

    this.map.on('style.load', () => {
      this.map.setFog({});
      this.map.resize();
    });
  }

  public changeMapAlign(align: number) {
    this.align = align;
    timer(10).subscribe((x) => {
      this.map.resize();
    });
  }

  public changeVisualizationType() {
    let ids = ['route', 'LineString'];

    ids.forEach((x) => {
      if (this.map.getLayer(x)) {
        this.map.removeLayer(x);
      }
      if (this.map.getSource(x)) {
        this.map.removeSource(x);
      }
    });

    $('#changeTab').modal('hide');

  }
}
