import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Point, Edge } from '../models/path-finder';
import { DataStructure } from '../path-finder/path-finder.component';

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  points: Point[] = [];
  edges: Edge[] = [];

  pointsListChange: EventEmitter<Point[]> = new EventEmitter();
  edgesListChange: EventEmitter<Edge[]> = new EventEmitter();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
  };

  constructor(private http: HttpClient) { }

  addPoint(point: Point): void {
    this.points = [...this.points, {
      name: `Point - ${this.points.length + 1}`,
      lat: point.lat,
      lon: point.lon,
      alt: point.alt,
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

  editPointPosition(point: Point): void {
    this.points = this.points.map(elem => {
      if (elem.name === point.name) {
        return point;
      } else {
        return elem;
      }
    });
    this.pointsListChange.emit(this.points);
  }

  addEdge(source: Point, target: Point): void {
    this.edges = [...this.edges, 
    {
      name: `Edge - ${this.edges.length + 1}`,
      source,
      target
    }];
    this.edgesListChange.emit(this.edges);
  }

  removeEdge(name: string): void {
    this.edges = this.edges.filter(elem => elem.name != name);
    this.edges.forEach((point, index) => {
      point.name = `Edge - ${index + 1}`;
    });
    this.edgesListChange.emit(this.edges);
  }

  editEdgePositions(edge: Edge): void {
    this.edges = this.edges.map(elem => {
      if (elem.name === edge.name) {
        return edge;
      } else {
        return elem;
      }
    });
    this.edgesListChange.emit(this.edges);
  }

  updateData(points: Point[], edges: Edge[]) {
    this.points = points;
    this.pointsListChange.emit(this.points);
    this.edges = edges;
    this.edgesListChange.emit(this.edges);
  }

  computeShortestPath(dataToSend: DataStructure): Observable<any> {
    const url = 'http://127.0.0.1:8080/get-shortest-path';
    return this.http.post<any>(url, dataToSend, this.httpOptions)
      .pipe(
        map((returnData) => {
          return returnData;
        })
      )
  }
}
