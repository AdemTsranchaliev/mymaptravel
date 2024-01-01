import { Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { timer } from 'rxjs';
import { MapService } from 'src/app/shared/map.service';
import { MapModel } from '../map.model';

@Component({
  selector: 'app-choose-map-style',
  templateUrl: './choose-map-style.component.html',
  styleUrls: ['./choose-map-style.component.css'],
})
export class ChooseMapStyleComponent implements OnInit {
  public avaliableStyles: string[] = [
    'mapbox://styles/ademski/cl8wyrlke005415n2wa35vuzd',
    'mapbox://styles/ademski/cl8wzfy8m00lf16piws6wenl1',
    'mapbox://styles/ademski/cla2m093r003l14pa9e280789',
    'mapbox://styles/ademski/cla2m093r003l14pa9e280789',
    'mapbox://styles/ademski/cla2m085500r814o2dfluep9a',

  ];
  @Input() map: mapboxgl.Map;
  @Input() mapData: MapModel;
  @Input() geocoders: any;

  public selectedStyle: number = 1;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {}

  public changeMapStyle(id: number) {
    this.map.setStyle(this.avaliableStyles[id - 1]);
    timer(500).subscribe(x=>{
      if(this.mapData.selectedVisualization==0){
        this.mapService.addLines(this.map, this.mapData.getCoordinates());
      }
      else if(this.mapData.selectedVisualization==1){
        this.mapService.getDirectionsByCoordinates(this.mapData.getCoordinates()).subscribe((x:any)=>{
          console.log(x);
          this.mapService.addDirections(this.map, x.routes[0].geometry.coordinates);
        });
      }
      this.mapService.addMarkerDynamic(this.map,this.mapData.coordinates,this.mapData.coordinates.length);

    });

    this.selectedStyle = id;
  }
}
