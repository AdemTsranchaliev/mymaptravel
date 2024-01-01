import { Component, Input, OnInit } from '@angular/core';
import { MapModel } from '../map.model';
import { Map } from 'mapbox-gl';
import { MapService } from 'src/app/shared/map.service';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-choose-view',
  templateUrl: './choose-view.component.html',
  styleUrls: ['./choose-view.component.css'],
})
export class ChooseViewComponent implements OnInit {
  @Input() map: Map;
  @Input() mapData: MapModel;

  viewPoint: MapboxGeocoder;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {

    this.viewPoint = this.mapService.getGeocoder('Ню Йорк');

    this.map.on('load', () => {
      
      document
        .getElementById('viewPoint')!
        .replaceWith(this.viewPoint.onAdd(this.map));
    });
  }
}