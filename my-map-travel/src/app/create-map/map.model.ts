export class MapModel {
  coordinates: Point[] = [];
  selectedStyle: string;
  selectedVisualization: number = 0;
  align: number;

  getCoordinates() {
    let coordinates = [];

    this.coordinates.forEach((element) => {
      coordinates.push([element.longitude, element.latitude]);
    });

    return coordinates;
  }
}

export class Point {
  longitude: number = 0;
  latitude: number = 0;
  placeName: string = '';
}
