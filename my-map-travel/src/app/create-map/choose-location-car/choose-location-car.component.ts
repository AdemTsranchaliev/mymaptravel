import { Component, Input, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { timer } from 'rxjs';
import { MapService } from 'src/app/shared/map.service';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-choose-location-car',
  templateUrl: './choose-location-car.component.html',
  styleUrls: ['./choose-location-car.component.css'],
})
export class ChooseLocationCarComponent implements OnInit {
  @Input() map: Map;
  startPoint: MapboxGeocoder;
  endPoint: MapboxGeocoder;

  public startSelected: any;
  public endSelected: any;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.startPoint = this.mapService.getGeocoder('startPoint');
    this.endPoint = this.mapService.getGeocoder('endPoint');
    this.map.on('load', () => {
      document
        .getElementById('startPoint')!
        .replaceWith(this.startPoint.onAdd(this.map));
      document
        .getElementById('endPoint')!
        .replaceWith(this.endPoint.onAdd(this.map));
    });
    this.startPoint.on('result', (results) => {
      this.startSelected = results?.result;
    });

    this.endPoint.on('result', (results) => {
      this.endSelected = results?.result;

      this.mapService
        .getDirections(
          this.startSelected.geometry.coordinates[0],
          this.startSelected.geometry.coordinates[1],
          this.endSelected.geometry.coordinates[0],
          this.endSelected.geometry.coordinates[1]
        )
        .subscribe((x: any) => {
          console.log(this.map);
          timer(10).subscribe(() => {
            this.mapService.addDirections(
              this.map,
              x.routes[0].geometry.coordinates
            );
          });
        });
    });
  }
}
