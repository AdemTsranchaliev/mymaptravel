import { Component, Input, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-choose-map-style',
  templateUrl: './choose-map-style.component.html',
  styleUrls: ['./choose-map-style.component.css']
})
export class ChooseMapStyleComponent implements OnInit {

  public avaliableStyles: string[] =[
    'mapbox://styles/ademski/cl9717abj003914qqeisu4o2j',
    'mapbox://styles/ademski/cl8wzud5c003h14nroc6ygwxt',
    'mapbox://styles/ademski/cl8wzfbkz002b15qut2675ych'
  ];
  @Input() map: mapboxgl.Map;
  public selectedStyle:number = 1;
  constructor() { }

  ngOnInit(): void {
  }

  public changeMapStyle(id: number){
    this.map.setStyle(this.avaliableStyles[id-1]);

    this.selectedStyle = id;
  }
}
