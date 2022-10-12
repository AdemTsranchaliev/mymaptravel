import { Component, Input, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { timer } from 'rxjs';
import { MapService } from 'src/app/shared/map.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-choose-location-plane',
  templateUrl: './choose-location-plane.component.html',
  styleUrls: ['./choose-location-plane.component.css'],
})
export class ChooseLocationPlaneComponent implements OnInit {
  @Input() map: Map;
  @Input() startPoint: MapboxGeocoder;
  @Input() endPoint: MapboxGeocoder;

  public startSelected: any;
  public endSelected: any;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.startPoint.on('result', (results) => {
      this.startSelected = results?.result;
    });

    this.endPoint.on('result', (results) => {
      this.endSelected = results?.result;
      
      if (this.endSelected?.geometry) {
        if (this.map.getLayer("route")) {
          this.map.removeLayer("route");
      }
      
      if (this.map.getSource("route")) {
        this.map.removeSource("route");
      }

        let myuuid = 'route';
        this.map.addSource(myuuid, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                this.startSelected?.geometry?.coordinates,
                this.endSelected?.geometry?.coordinates, // northeastern corner of the bounds
              ],
            },
          },
        });

        this.map.addLayer({
          id: myuuid,
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

        timer(300).subscribe(() => {
          this.map.fitBounds([
            this.startSelected?.geometry?.coordinates,
            this.endSelected?.geometry?.coordinates, // northeastern corner of the bounds
          ], {padding: 100});
        });
      }
    });
  }
}
