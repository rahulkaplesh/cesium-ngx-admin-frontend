import { EventEmitter, Injectable } from '@angular/core';
import { Point } from '../models/path-finder';

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  points: Point[] = [];

  pointsListChange: EventEmitter<Point[]> = new EventEmitter();

  constructor() { }

  addPoint(): void {
    this.points = [...this.points, {
      name: `Point - ${this.points.length + 1}`,
      lat: 0.0,
      lon: 0.0,
      alt: 0.0,
    }];
    this.pointsListChange.emit(this.points);
  }

  deletePoint(name: string): void {
    this.points = this.points.filter(elem => elem.name != name);
    this.points.forEach((point, index) => {
      point.name = `Point - ${index + 1}`;
    });
    this.pointsListChange.emit(this.points);
  }
}
