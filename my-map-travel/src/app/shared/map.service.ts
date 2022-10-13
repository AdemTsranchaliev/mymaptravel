import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Enviorment } from './enviorment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private env: Enviorment, private http: HttpClient) {}

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
        : 'mapbox://styles/ademski/cl8wzud5c003h14nroc6ygwxt',
      center: center,
      zoom: zoom ? zoom : 1,
      accessToken: this.env.MAPBOX_PUBLIC_KEY,
      projection: {
        name: 'mercator',
      },
    });
  }

  public getGeocoder(placeholder?: string) {
    return new MapboxGeocoder({
      accessToken: this.env.MAPBOX_PUBLIC_KEY,
      mapboxgl: mapboxgl,
      marker: false,
      flyTo: true,
      placeholder: placeholder ? placeholder : 'Търсене',
    });
  }

  public getDirections(startLat: any, startLng: any, endLat: any, endLng: any) {
    return this.http.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startLat},${startLng};${endLat},${endLng}?geometries=geojson&access_token=${this.env.MAPBOX_PUBLIC_KEY}`
    );
  }

  public addDirections(map: mapboxgl.Map, coordinates: any[]) {
    let id = 'LineString';

    let geojson: any = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            properties: {},
            coordinates: coordinates,
          },
        },
      ],
    };
    if (map.getSource(id)) {
      map.getSource(id).setData(geojson);
    } else {
      map.addSource('LineString', {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: 'LineString',
        type: 'line',
        source: 'LineString',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#BF93E4',
          'line-width': 5,
        },
      });
    }

    timer(10).subscribe(() => {
      map.fitBounds([coordinates[0], coordinates[coordinates.length - 1]], {
        padding: 160,
      });
    });
  }

  public addLine(
    map: mapboxgl.Map,
    startCoordinates: any,
    endCoordinates: any
  ) {
    let id = 'route';
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
    if (map.getSource(id)) {
      map.removeSource(id);
    }

    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [startCoordinates, endCoordinates],
        },
      },
    });

    map.addLayer({
      id: id,
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#888',
        'line-width': 5,
      },
    });

    timer(10).subscribe(() => {
      map.fitBounds([startCoordinates, endCoordinates], { padding: 60 });
    });
  }
}
