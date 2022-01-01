export interface Point {
  name: string,
  lat: number,
  lon: number,
  alt: number,
}

export interface Edge {
  name: string,
  source: Point,
  target: Point
}