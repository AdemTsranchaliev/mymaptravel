import { Component, Input, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { timer } from 'rxjs';
import { MapService } from 'src/app/shared/map.service';
import { v4 as uuidv4 } from 'uuid';
import { MapModel } from '../map.model';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-choose-location-plane',
  templateUrl: './choose-location-plane.component.html',
  styleUrls: ['./choose-location-plane.component.css'],
})
export class ChooseLocationPlaneComponent implements OnInit {
  @Input() map: Map;
  @Input() mapData: MapModel;
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
      this.generateLine();
    });

    this.endPoint.on('result', (results) => {
      this.endSelected = results?.result;
      this.generateLine();
    });
  }

  public generateLine() {
    if (this.endSelected && this.startSelected) {
      timer(300).subscribe(() => {
        this.mapService.addLine(
          this.map,
          this.startSelected?.geometry?.coordinates,
          this.endSelected?.geometry?.coordinates
        );
      });
    }
  }
}
