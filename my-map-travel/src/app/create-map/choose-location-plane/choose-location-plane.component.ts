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
  public geocoderNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  public startSelected: any;
  public endSelected: any;
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
    let coordinates: any[] = [];
    this.geocoders.forEach((geocoder, index) => {
      if (index < this.firstFreeIndex) {
        if (geocoder[this.geocoderNumbers[index]]) {
          coordinates.push(
            geocoder[this.geocoderNumbers[index]]?.geometry?.coordinates
          );
        } else if (geocoder?.geometry) {
          coordinates.push(geocoder?.geometry?.coordinates);
        }
      }
    });
    // this.mapService.addMarker(
    //   this.map,
    //   this.startSelected?.geometry?.coordinates,
    //   this.startSelected?.text,
    //   this.endSelected?.geometry?.coordinates,
    //   this.endSelected?.text
    // );
    this.mapService.addMarkerDynamic(
      this.map,
      this.geocoders,
      this.geocoderNumbers,
      this.firstFreeIndex
    );
    this.mapService.addLines(this.map, coordinates);
  }

  removePoint() {
    this.showProperties[this.firstFreeIndex - 1] = false;
    this.geocoders[this.firstFreeIndex - 1].clear();
    this.firstFreeIndex--;
    this.generateLine();

    // //Remove elements
    // let item = this.geocoders.splice(index, 1);
    // this.showProperties.splice(index, 1);
    // let deletedNumber = this.geocoderNumbers.splice(index, 1);

    // let pp = this.mapService.getGeocoder('Нова точка');
    // //Add new elements
    // this.geocoders.push(pp);
    // this.showProperties.push(false);
    // this.geocoderNumbers.push(deletedNumber[0]);
    // this.firstFreeIndex--;

    // this.map.on('load', () => {
    //   document
    //     .getElementById(`point-${index}`)!
    //     .replaceWith(pp.onAdd(this.map));
    // });

    // pp.on('result', (results) => {
    //   pp = results?.result;
    //   if (index >= 1) this.generateLine();
    // });
  }
}
