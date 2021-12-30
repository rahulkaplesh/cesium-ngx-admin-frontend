import { Cartesian3 } from 'angular-cesium';
import { Cartographic } from 'cesium';
import { Point } from '../models/path-finder';

export function convertCartesianPointsToPathFinderPoint(cartesianPoint: Cartesian3, name: string): Point {
  let pos: Cartographic = Cesium.Cartographic.fromCartesian(cartesianPoint);
  return {
    name: name,
    lat: (pos.latitude / Math.PI * 180),
    lon: (pos.longitude / Math.PI * 180),
    alt: pos.height,
  };
}

export function convertPathFinderPointsToCartesianPoints(point: Point): Cartesian3 {
  return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt);
}

