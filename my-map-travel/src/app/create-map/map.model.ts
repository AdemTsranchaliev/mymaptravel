export class MapModel {
  routes: Route[];
  selectedStyle: string;
  selectedVisualization: number;
  align: number;
}

export class Route {
  startPoint: Place;
  endPoint: Place;
}

export class Place {
  longitude: number;
  latitude: number;
  placeName: string;
}
