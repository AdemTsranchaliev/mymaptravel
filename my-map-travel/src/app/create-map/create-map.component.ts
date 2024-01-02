import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MapService } from '../shared/map.service';
import { HttpClient } from '@angular/common/http';
import { MapModel } from './map.model';
declare var $: any;

@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.component.html',
  styleUrls: ['./create-map.component.css'],
})
export class CreateMapComponent implements OnInit {
  public map: mapboxgl.Map;
  public mapData: MapModel = new MapModel();
  public startSelected: any;
  public endSelected: any;
  public innerWidth: number;
  public align: number = 2;
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  @ViewChild('stepper') stepper: MatStepper;

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
    private mapService: MapService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.map = this.mapService.initializeMap();
    this.innerWidth = window.innerWidth;
    this.map.on('style.load', () => {
      
      this.map.resize();
    });
  }

  public changeMapAlign(align: number) {
    this.align = align;
    timer(10).subscribe((x) => {
      this.map.resize();
    });
    console.log(this.mapData);
  }

  public changeVisualizationType() {
    let ids = ['route', 'LineString', 'points'];

    ids.forEach((x) => {
      if (this.map.getLayer(x)) {
        this.map.removeLayer(x);
      }
      if (this.map.getSource(x)) {
        this.map.removeSource(x);
      }
    });
    this.mapData.coordinates = [];
    $('#changeTab').modal('hide');
  }

  disableMap(event) {
    if (event.selectedIndex == 2) {
      this.map['scrollZoom'].disable();
      this.map['boxZoom'].disable();
      this.map['dragRotate'].disable();
      this.map['dragPan'].disable();
      this.map['keyboard'].disable();
      this.map['doubleClickZoom'].disable();
      this.map['touchZoomRotate'].disable();
    } else {
      this.map['scrollZoom'].enable();
      this.map['boxZoom'].enable();
      this.map['dragRotate'].enable();
      this.map['dragPan'].enable();
      this.map['keyboard'].enable();
      this.map['doubleClickZoom'].enable();
      this.map['touchZoomRotate'].enable();
    }
  }

  public changeType(typeId: number) {
    if (typeId != this.mapData.selectedVisualization) {
      this.mapData.selectedVisualization = typeId;
      if (this.mapData.coordinates.length > 0) {
        $('#changeTab').modal('show');
      }
    }
  }
}
