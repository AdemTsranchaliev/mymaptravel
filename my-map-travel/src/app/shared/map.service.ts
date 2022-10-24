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
      addressAccuracy: 'place',
      getItemValue: function (item) {
        return item.text;
      },
      render: function (item) {
        return `<div class='geocoder-dropdown-item'>
                    <span class='geocoder-dropdown-text'>
                      ${item.text}
                    </span>
                    <footer class="blockquote-footer">${item.place_name}</footer>
                 </div>`;
      },
    });
  }

  public getDirections(startLat: any, startLng: any, endLat: any, endLng: any) {
    return this.http.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startLat},${startLng};${endLat},${endLng}?geometries=geojson&access_token=${this.env.MAPBOX_PUBLIC_KEY}`
    );
  }

  public getDirectionsByCoordinates(coordinates:any[]) {
    let result='';
    coordinates.forEach((x,index)=>{
      if(coordinates.length-1==index){
        result+=`${x[0]},${x[1]}`
      }
      else{
        result+=`${x[0]},${x[1]};`
      }
    });

    return this.http.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${result}?geometries=geojson&access_token=${this.env.MAPBOX_PUBLIC_KEY}`
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
          'line-color': '#000000',
          'line-width': 2,
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
        'line-color': '#000000',
        'line-width': 1,
      },
    });

    timer(10).subscribe(() => {
      map.fitBounds([startCoordinates, endCoordinates], { padding: 60 });
    });
  }

  addMarker(
    map: mapboxgl.Map,
    startCoordinates,
    startMarkerName,
    endCoordinates,
    endMarkerName
  ) {
    if (map.getSource('points')) {
      //  map.getSource('points')._data.features.push({
      //     // feature for Mapbox SF
      //     'type': 'Feature',
      //     'geometry': {
      //     'type': 'Point',
      //     'coordinates': [-122.414, 37.776]
      //     },
      //     'properties': {
      //     'title': 'Mapbox SF'
      //     }
      //     });

      map.getSource('points').setData({
        type: 'FeatureCollection',
        features: [
          {
            // feature for Mapbox DC
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: startCoordinates,
            },
            properties: {
              title: startMarkerName,
            },
          },
          {
            // feature for Mapbox DC
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: endCoordinates,
            },
            properties: {
              title: endMarkerName,
            },
          },
        ],
      });
    } else {
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              // feature for Mapbox DC
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: startCoordinates,
              },
              properties: {
                title: startMarkerName,
              },
            },
            {
              // feature for Mapbox DC
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: endCoordinates,
              },
              properties: {
                title: endMarkerName,
              },
            },
          ],
        },
      });
    }

    if (map.getLayer('points')) {
      map.removeLayer('points');
    }
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      },
    });
  }
  addMarkerDynamic(map: mapboxgl.Map, geocoders, length) {
    let data: any[] = [];

    geocoders.forEach((geocoder, index) => {
      if (index < length) {
        let temp: any;

        if (geocoder[index]) {
          temp = geocoder[index];
        } else if (geocoder?.geometry) {
          temp = geocoder;
        }

        data.push({
          // feature for Mapbox DC
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: temp?.geometry?.coordinates,
          },
          properties: {
            title: temp?.text,
          },
        });
      }
    });

    if (map.getSource('points')) {
      map.getSource('points').setData({
        type: 'FeatureCollection',
        features: data,
      });
    } else {
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data,
        },
      });
    }

    if (map.getLayer('points')) {
      map.removeLayer('points');
    }
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      },
    });
  }

  public addLines(map: mapboxgl.Map, coordinates: any[]) {
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
          coordinates: coordinates,
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
        'line-color': '#000000',
        'line-width': 1,
      },
    });

    // timer(10).subscribe(() => {

    //   map.fitBounds(coordinates, { padding: 60 });
    // });
  }

  getCoordinatesByGeocoder(geocoders: any, lenght: number){
    let coordinates: number[] = [];
     geocoders.forEach((geocoder, index) => {
      if (index < lenght) {
        if (geocoder[index]) {
          coordinates.push(
            geocoder[index]?.geometry?.coordinates
          );
        } else if (geocoder?.geometry) {
          coordinates.push(geocoder?.geometry?.coordinates);
        }
      }
    });

    return coordinates;
  }

  getCenterCoordinates(coordinates: any[]) {
    let lat = 0;
    let lon = 0;
    coordinates.forEach((element) => {
      lat += element[0];
      lon += element[1];
    });
    var llb = new mapboxgl.LngLatBounds([lon, lat]);
    return llb;
  }
}
