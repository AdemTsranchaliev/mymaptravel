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

  public startSelected: any = null;
  public endSelected: any = null;

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
        if (index >= 1) this.generateDirections();
      });
    });
  }

  public generateDirections() {
    let coordinates: number[] = this.mapService.getCoordinatesByGeocoder(
      this.geocoders,
      this.firstFreeIndex
    );

    this.mapService
      .getDirectionsByCoordinates(coordinates)
      .subscribe((x: any) => {
        timer(10).subscribe(() => {
          this.mapService.addMarkerDynamic(
            this.map,
            this.geocoders,
            this.firstFreeIndex
          );

          this.mapService.addDirections(
            this.map,
            x.routes[0].geometry.coordinates
          );
        });
      });
  }

  public addLine() {
    this.showProperties[this.firstFreeIndex] = true;
    this.firstFreeIndex++;
  }

  removePoint() {
    this.showProperties[this.firstFreeIndex - 1] = false;
    this.geocoders[this.firstFreeIndex - 1].clear();
    this.firstFreeIndex--;
    this.generateDirections();
  }
}
