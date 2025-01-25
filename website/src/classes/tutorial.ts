export type Tutorials = Tutorial[]

export interface Tutorial {
  title: string
  subtitle: string
  basemap?: Basemap
  maps: Map[]
}

export interface Basemap {
  style: string
  centerLng: number
  centerLat: number
  zoom: number
}

export interface Map {
  screenName: string
  protocol: string
  protocolData?: string
  source: Source
  layer: Layer
}

export interface Source {
  name: string
  type: string
  url: string
  tileSize?: number
  minzoom?: number
  maxzoom?: number
}

export interface Layer {
  id: string
  source: string
  sourceLayer: string
  type: string
  paint?: Paint
}

export interface Paint {
  fillColor: string
  fillOutlineColor: string
  fillOpacity: number
  rasterOpacity: number
}
