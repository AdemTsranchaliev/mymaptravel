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
  startPoint: MapboxGeocoder;
  endPoint: MapboxGeocoder;
  initData: string[] = ['Начална точка','Крайна точка'];

  public geocoders: any[] = [];
  public startSelected: any;
  public endSelected: any;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.geocoders.push(this.mapService.getGeocoder('Начална точка'));
    this.geocoders.push(this.mapService.getGeocoder('Крайна точка'));

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
        if (index == 1) this.generateLine();
      });
    });
  }

  public addLine() {
    let temp = this.mapService.getGeocoder('Нова точка');
    this.geocoders.push(temp);
    timer(10).subscribe(() => {
      document
        .getElementById(`point-${this.geocoders.length - 1}`)!
        .replaceWith(this.geocoders[this.geocoders.length - 1].onAdd(this.map));

      this.geocoders[this.geocoders.length - 1].on('result', (results) => {
        this.geocoders[this.geocoders.length - 1] = results?.result;
        this.generateLine();
      });
    });
  }
 
  public generateLine() {
    if (this.geocoders.length >= 2) {
      timer(10).subscribe(() => {
        let coordinates: any[] = [];
        this.geocoders.forEach((geocoder, index) => {
          console.log(geocoder);
          if(geocoder[index]){
            coordinates.push(geocoder[index]?.geometry?.coordinates);
          }
          else{
            coordinates.push(geocoder?.geometry?.coordinates);
          }
        });
        // this.mapService.addMarker(
        //   this.map,
        //   this.startSelected?.geometry?.coordinates,
        //   this.startSelected?.text,
        //   this.endSelected?.geometry?.coordinates,
        //   this.endSelected?.text
        // );

        this.mapService.addLines(this.map, coordinates);
      });
    }
  }
}
