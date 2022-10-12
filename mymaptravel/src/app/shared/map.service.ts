import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Enviorment } from './enviorment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private env: Enviorment) {}

  public initializeMap(
    containerId?: string,
    center?: any,
    zoom?: number,
    style?: string
  ) {
    return new mapboxgl.Map({
      container: containerId ? containerId : 'map',
      style: style
        ? style
        : 'mapbox://styles/ademski/cl8wyrlke005415n2wa35vuzd',
      center: center,
      zoom: zoom ? zoom : 1,
      accessToken: this.env.MAPBOX_PUBLIC_KEY,
    });
  }

  public getGeocoder(placeholder?: string){
    return new MapboxGeocoder({
        accessToken: this.env.MAPBOX_PUBLIC_KEY,
        mapboxgl: mapboxgl,
        marker: false,
        flyTo: true,
        placeholder: placeholder ? placeholder : 'Търсене'
      });
  }
}
