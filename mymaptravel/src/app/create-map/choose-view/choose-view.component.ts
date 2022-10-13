import { Component, Input, OnInit } from '@angular/core';
import { MapModel } from '../map.model';
import { Map } from 'mapbox-gl';
import { MapService } from 'src/app/shared/map.service';

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

    this.viewPoint = this.mapService.getGeocoder('viewPoint');

    this.map.on('load', () => {
      document
        .getElementById('viewPoint')!
        .replaceWith(this.viewPoint.onAdd(this.map));
    });
  }
}




















// this.map.on('load', () => {
//   // Add an image to use as a custom marker
//   this.map.loadImage(
//     'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
//     (error, image) => {
//       if (error) throw error;
//       this.map.addImage('custom-marker', image);
//       // Add a GeoJSON source with 2 points
//       this.map.addSource('points', {
//         type: 'geojson',
//         data: {
//           type: 'FeatureCollection',
//           features: [
//             {
//               // feature for Mapbox DC
//               type: 'Feature',
//               geometry: {
//                 type: 'Point',
//                 coordinates: [-77.03238901390978, 38.913188059745586],
//               },
//               properties: {
//                 title: 'Mapbox DC',
//               },
//             },
//             {
//               // feature for Mapbox SF
//               type: 'Feature',
//               geometry: {
//                 type: 'Point',
//                 coordinates: [-122.414, 37.776],
//               },
//               properties: {
//                 title: 'Mapbox SF',
//               },
//             },
//           ],
//         },
//       });

//       // Add a symbol layer
//       this.map.addLayer({
//         id: 'points',
//         type: 'symbol',
//         source: 'points',
//         layout: {
//           // get the title name from the source's "title" property
//           'text-field': ['get', 'title'],
//           'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
//           'text-offset': [0, 1.25],
//           'text-anchor': 'top',
//         },
//       });
//     }
//   );
// });
