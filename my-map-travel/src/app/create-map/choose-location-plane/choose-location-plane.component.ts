import { Component, Input, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { timer } from 'rxjs';
import { MapService } from 'src/app/shared/map.service';
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
  showProperties: boolean[] = [
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  firstFreeIndex = 2;

  public geocoders: any[] = [
    this.mapService.getGeocoder('Начална точка'),
    this.mapService.getGeocoder('Крайна точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
    this.mapService.getGeocoder('Нова точка'),
  ];
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.map.on('load', () => {
      this.geocoders.forEach((geocoder, index) => {
        document
          .getElementById(`point-${index}`)!
          .replaceWith(geocoder.onAdd(this.map));
      });
    });

    this.geocoders.forEach((geocoder, index) => {
      geocoder.on('result', (results) => {
        geocoder[index] = results?.result;
        if (index >= 1) this.generateLine();
      });
    });
  }

  public addLine() {
    this.showProperties[this.firstFreeIndex] = true;
    this.firstFreeIndex++;
  }

  public generateLine() {
    let coordinates: number[] = this.mapService.getCoordinatesByGeocoder(
      this.geocoders,
      this.firstFreeIndex
    );

    this.mapService.addMarkerDynamic(
      this.map,
      this.geocoders,
      this.firstFreeIndex
    );
    this.mapService.addLines(this.map, coordinates);
  }

  removePoint() {
    this.showProperties[this.firstFreeIndex - 1] = false;
    this.geocoders[this.firstFreeIndex - 1].clear();
    this.firstFreeIndex--;
    this.generateLine();
  }
}
